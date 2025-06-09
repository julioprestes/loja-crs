import api from "@/utils/axios";

/**
 * Finaliza o pedido e redireciona para o Stripe Checkout.
 * @param {Object} params
 * @param {Array} params.cart - Itens do carrinho
 * @param {number|string} params.selectedEndereco - ID do endereço selecionado
 * @param {string} params.precoTotal - Preço total do pedido
 * @param {number} params.descontoPedido - Valor do desconto
 * @param {Object|null} params.pedidoCupomData - Dados do cupom (opcional)
 * @param {Function} params.saveCartToBackend - Função para salvar o carrinho no backend
 * @param {Function} params.setCart - Setter do carrinho
 * @param {Function} params.setPedidoCupom - Setter do cupom
 * @param {Function} params.setPedidoCupomData - Setter dos dados do cupom
 * @param {Function} params.setPedidoCupomError - Setter do erro do cupom
 * @param {Function} params.toaster - Toast utilitário
 * @param {Function} params.setLoading - Setter de loading
 */
export async function finalizarPedidoStripe({
  cart,
  selectedEndereco,
  precoTotal,
  descontoPedido,
  pedidoCupomData,
  saveCartToBackend,
  setCart,
  setPedidoCupom,
  setPedidoCupomData,
  setPedidoCupomError,
  toaster,
  setLoading,
}) {
  if (cart.length === 0) {
    toaster.create({ description: "Seu carrinho está vazio!", type: "error" });
    return;
  }
  if (!selectedEndereco) {
    toaster.create({ description: "Selecione um endereço para entrega!", type: "error" });
    return;
  }
  setLoading(true);
  try {
    const userId = localStorage.getItem("userId");
    const idUserCustomer = userId;
    const idUserDeliver = null;
    const idAddress = selectedEndereco;
    const idPayment = 1;
    const idCupom = pedidoCupomData?.id || null;

    const orderRes = await api.post("/orders", {
      status: "pendente",
      total: parseFloat(precoTotal),
      totalDiscount: descontoPedido,
      idUserCustomer,
      idUserDeliver,
      idAddress,
      idPayment,
      idCupom,
    });
    const idOrder = orderRes.data.data.id;
    for (const item of cart) {
      await api.post("/orders-products", {
        priceProducts: item.price,
        quantity: item.quantity,
        idOrder,
        idProduct: item.id,
      });
    }
    // Chama o backend para criar a sessão do Stripe
    const line_items = cart.map(item => ({
      price_data: {
        currency: 'brl',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));
    const sessionRes = await api.post("/stripe/create-checkout-session", {
      line_items,
      success_url: window.location.origin + "/carrinho?success=true",
      cancel_url: window.location.origin + "/carrinho?canceled=true",
    });
    if (sessionRes.data.url) {
      window.location.href = sessionRes.data.url;
      return;
    }
    setCart([]);
    localStorage.setItem(`cart_${userId}`, JSON.stringify([]));
    await saveCartToBackend(userId, []);
    setPedidoCupom("");
    setPedidoCupomData(null);
    setPedidoCupomError(null);
  } catch (error) {
    toaster.create({
      description: "Erro ao finalizar pedido: " + (error.response?.data?.message || error.message),
      type: "error",
    });
  }
  setLoading(false);
}
