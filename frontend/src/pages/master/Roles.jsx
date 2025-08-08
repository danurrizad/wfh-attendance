import React, { useEffect, useState } from 'react'
import useMasterDataService from "../../services/MasterDataService"
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table/Table'
import { Card, CardContent, CardHeader } from '../../components/ui/card/Card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'
import Breadcrumb from '../../components/ui/breadcrumb/Breadcrumb'
import Input from '../../components/forms/Input'
import { Modal } from '../../components/ui/modal/Modal'
import Button from '../../components/forms/Button'
import useVerify from '../../hooks/useVerify'

const Roles = () => {
    const { getMasterData, createMasterData, updateMasterDataById, deleteMasterDataById } = useMasterDataService()
    const { auth } = useVerify()
    const [rolesData, setRolesData] = useState([])
    const [idRole, setIdRole] = useState(null)
    const [form, setForm] = useState({
        roleName: ""
    })
    const [showModal, setShowModal] = useState({
        type: "add",
        add: false,
        update: false,
        delete: false,
    })

    const fetchMasterData = async() => {
        try {
            const response = await getMasterData("roles")
            setRolesData(response?.data?.data)
        } catch (error) {
            console.error(error)
        }
    }

    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value})
    }

    const handleOpenModal = (type, data) => {
        console.log("DATA: ", data)
        setShowModal({ 
            ...showModal, 
            type: type, 
            [type]: true
        })
        setIdRole(data?.ID)
        setForm({
            ...form,
            roleName: data?.ROLENAME
        })
    }

    const handleCloseModal = (type) => {
        setShowModal({ 
            ...showModal, 
            type: type, 
            [type]: false
        })
    }

    const handleSubmit = async() => {
        try {
            let response
            if(showModal.type === "add"){
                response = await createMasterData("role", form)
            }else if(showModal.type === "update"){
                response = await updateMasterDataById("role", idRole, form)
            }
            console.log("RESPOSNSE SUBMIT: ", response)
            fetchMasterData()
            handleCloseModal(showModal.type)
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async() => {
        try {
            const response = await deleteMasterDataById("role", idRole)
            console.log("RESPONSE DELETE: ", response)
            fetchMasterData()
            handleCloseModal(showModal.type)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        fetchMasterData()
    }, [])

    const renderModal = (type, data) => {
        return(
            <Modal
                isOpen={showModal?.[type]}
                onClose={()=>handleCloseModal(type)}
            >
                <Card>
                    <CardHeader>{type === "add" ? "Add" : type === "update" ? "Update" : type === "delete" ? "Delete" : ""} Role</CardHeader>
                    <CardContent>
                    { (type === "add" || type === "update") && (
                        <div>
                            <div>
                                <label>Role Name</label>
                                <Input
                                    placeholder="Role name"
                                    name="roleName"
                                    value={form.roleName}
                                    onChange={handleChangeInput}
                                />
                            </div>
                            <div className='mt-4 flex justify-end items-center gap-4'>
                                <Button onClick={()=>handleCloseModal(type)} variant='outline'>Cancel</Button>
                                <Button onClick={handleSubmit}>{type==="add" ? "Add" : type === "update" ? "Save" : ""}</Button>
                            </div>
                        </div>
                    )}
                    { type === "delete" && (
                        <div>
                            <div>
                                <h1>Are you sure want to delete role {data?.roleName}?</h1>
                            </div>
                            <div className='mt-4 flex justify-end items-center gap-4'>
                                <Button onClick={()=>handleCloseModal(type)} variant='outline'>Cancel</Button>
                                <Button onClick={handleDelete}>Delete</Button>
                            </div>
                        </div>
                    )}
                    </CardContent>
                </Card>
            </Modal>
        )
    }


  return (
    <div>
        <Breadcrumb subPage={"Master"} pageTitle={"Roles"}/>

        {/* Render Modal */}
        {renderModal(showModal.type, form)}

        {/* Card */}
        <div className='mt-4'>
            <Card>
                <CardContent>
                    {/* Buttons */}
                    <div className='mb-4 flex justify-between'>
                        <Button onClick={()=>handleOpenModal("add")} className=''>Add new</Button>
                        <Input
                            placeholder={"Search"}
                            endIcon={<FontAwesomeIcon icon={faSearch}/>}
                        />
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>Role Name</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rolesData.map((item, index)=>{
                                return(
                                    <TableRow key={index}>
                                        <TableCell>{index+1}</TableCell>
                                        <TableCell>{item.ROLENAME}</TableCell>
                                        <TableCell>
                                            <div className='flex items-center gap-4'>
                                                <Button variant='blue' disabled={auth.roleId === item.ID} onClick={()=>handleOpenModal("update", item)} ><FontAwesomeIcon icon={faEdit}/></Button>
                                                <Button variant='red' disabled={auth.roleId === item.ID} onClick={()=>handleOpenModal("delete", item)} ><FontAwesomeIcon icon={faTrash}/></Button>
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

export default Roles