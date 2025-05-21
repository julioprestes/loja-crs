import { Box, Flex, Image, Text } from "@chakra-ui/react";

const Footer = () => (
  <Box as="footer" bg="#323591" color="white" py={6} mt={12}>
    <Flex
      maxW="6xl"
      mx="auto"
      align="center"
      justify="space-between"
      px={4}
      direction={{ base: "column", md: "row" }}
      gap={4}
    >
      <Flex align="center" gap={3}>
        <Image
          src="/logo-mercado.png"
          alt="Logo Mercado"
          boxSize="40px"
          objectFit="contain"
        />
        <Text fontWeight="bold" fontSize="lg">
          Loja CRS
        </Text>
      </Flex>
      <Text fontSize="sm" color="gray.400">
        © {new Date().getFullYear()} Loja CRS.
      </Text>
    </Flex>
  </Box>
);

export default Footer;