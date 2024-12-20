import { useState } from 'react'
import { useBreakpointValue } from '@chakra-ui/react'

import { 
  Box,
  Grid,
  GridItem,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot
} from '@chakra-ui/react'; 

import Sidebar from './components/Sidebar/index.js'
import Header from './components/Header/index.js'
import Footer from './components/Footer/index.js'

const smVariant = { navigation: 'drawer', navigationButton: true }
const mdVariant = { navigation: 'sidebar', navigationButton: false }

export default function App() { 

const [isSidebarOpen, setSidebarOpen] = useState(false) 
const variants = useBreakpointValue({ base: smVariant, md: mdVariant }) 

const toggleSidebar = () => setSidebarOpen(!isSidebarOpen) 

	return ( 
 		<> 
		 <Sidebar 
 			 variant={variants.navigation} 
 			 isOpen={isSidebarOpen} 
 			 onClose={toggleSidebar} 
 		 /> 
 		 <Box ml={!variants?.navigationButton && 240}> 
 			 <Header 
 				 showSidebarButton={variants?.navigationButton} 
 				 onShowSidebar={toggleSidebar} 
 		 /> 
			<Box p="5">
			    <Grid gap={6} templateColumns={{base:'repeat(1,1fr)',lg:'repeat(2,1fr)'}}>
			        <GridItem>
			            <TableContainer>
			                <Table size="md">
			                    <Thead>
			                        <Tr>
			                            <Th spellcheck="false">
			                                Player
			                            </Th>
			                            <Th>
			                                Team
			                            </Th>
			                            <Th>
			                                Position
			                            </Th>
			                            <Th>
			                                Conversion Rate
			                            </Th>
			                        </Tr>
			                    </Thead>
			                    <Tbody>
			                        <Tr>
			                            <Td>
			                                /reactbuilder.dev
			                            </Td>
			                            <Td>
			                                45%
			                            </Td>
			                            <Td>
			                                00:00:30
			                            </Td>
			                            <Td>
			                                1.23%
			                            </Td>
			                        </Tr>
			                        <Tr>
			                            <Td>
			                                /reactbuilder.dev
			                            </Td>
			                            <Td>
			                                21%
			                            </Td>
			                            <Td>
			                                00:04:24
			                            </Td>
			                            <Td>
			                                2.14%
			                            </Td>
			                        </Tr>
			                        <Tr>
			                            <Td>
			                                /reactbuilder.dev
			                            </Td>
			                            <Td>
			                                38%
			                            </Td>
			                            <Td>
			                                00:03:58
			                            </Td>
			                            <Td>
			                                1.85%
			                            </Td>
			                        </Tr>
			                    </Tbody>
			                    <Tfoot>
			                        <Tr>
			                            <Td>
			                                /reactbuilder.dev
			                            </Td>
			                            <Td>
			                                55%
			                            </Td>
			                            <Td>
			                                00:01:40
			                            </Td>
			                            <Td>
			                                1.08%
			                            </Td>
			                        </Tr>
			                    </Tfoot>
			                </Table>
			            </TableContainer>
			        </GridItem>
			        <GridItem>
			            <TableContainer>
			                <Table size="md">
			                    <Thead>
			                        <Tr>
			                            <Th>
			                                Language
			                            </Th>
			                            <Th>
			                                Users
			                            </Th>
			                            <Th spellcheck="false">
			                                Users(%)
			                            </Th>
			                        </Tr>
			                    </Thead>
			                    <Tbody>
			                        <Tr>
			                            <Td>
			                                en-us
			                            </Td>
			                            <Td>
			                                458
			                            </Td>
			                            <Td>
			                                52.52%
			                            </Td>
			                        </Tr>
			                        <Tr>
			                            <Td>
			                                en-gb
			                            </Td>
			                            <Td>
			                                112
			                            </Td>
			                            <Td>
			                                12.84%
			                            </Td>
			                        </Tr>
			                        <Tr>
			                            <Td>
			                                fr-fr
			                            </Td>
			                            <Td>
			                                33
			                            </Td>
			                            <Td>
			                                3.78%
			                            </Td>
			                        </Tr>
			                        <Tr>
			                            <Td>
			                                de-de
			                            </Td>
			                            <Td>
			                                22
			                            </Td>
			                            <Td>
			                                2.52%
			                            </Td>
			                        </Tr>
			                    </Tbody>
			                </Table>
			            </TableContainer>
			        </GridItem>
			    </Grid>
			</Box>
		 <Footer></Footer> 
	 </Box> 
		 </> 
 	 ) 
}
 
