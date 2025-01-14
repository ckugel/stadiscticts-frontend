import { Box, IconButton, Text, Flex } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import SearchBar from '../SearchBar/SearchBar'

interface Props {
    onShowSidebar: Function,
    showSidebarButton: boolean,
    onSearch: Function
}

const Header = ({ showSidebarButton = true, onShowSidebar, onSearch }: Props) => {
    return (
        <Flex bg="#151515" p={4} color="white" justifyContent="center" w="100%">
            <Box flex="1">
                {showSidebarButton && (
                    <IconButton
                        icon={<ChevronRightIcon w={5} h={5} />}
                        colorScheme="white"
                        variant="outline"
                        size="sm"
                        onClick={onShowSidebar}
                    />
                )}
            </Box>
            {!showSidebarButton && (
                <Box display="flex" ml="auto" alignItems="center" justifyContent="center" h="30px">
                    <Text fontSize="md" mr="5">About Us</Text>
                    <Text fontSize="md" mr="5">Contact</Text>
                    <Text fontSize="md" mr="5">Terms</Text>
                </Box>
            )}
            <Box display="flex" ml="auto" alignItems="center" justifyContent="center" h="30px">
                <SearchBar onSearch={onSearch} />
            </Box>
        </Flex>
    )
}

export default Header