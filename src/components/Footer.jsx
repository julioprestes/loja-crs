import { Box, Flex, Image, Text } from "@chakra-ui/react";

const Footer = () => (
  <Box as="footer" bg="blackAlpha.900" color="white" py={6} mt={12}>
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
          src="/Pizza_Steve.png"
          alt="Logo Steve"
          boxSize="40px"
          objectFit="contain"
        />
        <Text fontWeight="bold" fontSize="lg">
          Steve Pizza
        </Text>
      </Flex>
      <Text fontSize="sm" color="gray.400">
        © {new Date().getFullYear()} Steve Pizza.
      </Text>
    </Flex>
  </Box>
);

export default Footer;