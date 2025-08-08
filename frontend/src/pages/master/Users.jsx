import React, { useEffect, useState } from 'react'
import useMasterDataService from '../../services/MasterDataService'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table/Table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Card, CardContent } from '../../components/ui/card/Card'
import Breadcrumb from '../../components/ui/breadcrumb/Breadcrumb'
import Input from "../../components/forms/Input"

const Users = () => {
    const { getMasterData } = useMasterDataService()
    const [usersData, setUsersData] = useState([])

    const fetchMasterData = async() => {
        try {
            const response = await getMasterData("users")
            console.log(response?.data?.data)
            setUsersData(response?.data?.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        fetchMasterData()
    }, [])
  return (
    <div className=''>
        <Breadcrumb subPage={"Master"} pageTitle={"Users"}/>

        {/* Card */}
        <div className='mt-4'>
            <Card>
                <CardContent>
                    {/* Button and Search */}
                    <div className='mb-4 flex justify-between'>
                        <button className='bg-green-500 px-10 py-1 rounded-md text-white'>Add new</button>
                        <Input
                            placeholder={"Search"}
                            endIcon={<FontAwesomeIcon icon={faSearch}/>}
                        />
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role Name</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {usersData.map((item, index)=>{
                                return(
                                    <TableRow key={index}>
                                        <TableCell>{index+1}</TableCell>
                                        <TableCell>{item.NAME}</TableCell>
                                        <TableCell>{item.USERNAME}</TableCell>
                                        <TableCell>{item.EMAIL}</TableCell>
                                        <TableCell>{item.ROLENAME}</TableCell>
                                        <TableCell>
                                            <div className='flex items-center gap-4'>
                                                <button className='bg-blue-500 hover:bg-blue-700 cursor-pointer p-3 text-white rounded-md '><FontAwesomeIcon icon={faEdit}/></button>
                                                <button className='bg-red-500 hover:bg-red-700 cursor-pointer p-3 text-white rounded-md '><FontAwesomeIcon icon={faTrash}/></button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}

export default Users