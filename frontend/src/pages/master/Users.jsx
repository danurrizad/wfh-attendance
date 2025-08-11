import React, { useEffect, useState } from 'react'
import useMasterDataService from '../../services/MasterDataService'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table/Table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Card, CardContent, CardHeader } from '../../components/ui/card/Card'
import Breadcrumb from '../../components/ui/breadcrumb/Breadcrumb'
import Input from "../../components/forms/Input"
import Button from "../../components/forms/Button"
import { Modal } from "../../components/ui/modal/Modal"
import Select from '../../components/forms/Select'
import { useDebounce } from '../../hooks/useDebounce'
import Pagination from '../../components/ui/table/Pagination'
import LoadingTable from '../../components/ui/table/LoadingTable'

const Users = () => {
    const [loading, setLoading] = useState(true)
    const { getMasterData, createMasterData, updateMasterDataById, deleteMasterDataById } = useMasterDataService()
    const [usersData, setUsersData] = useState([])
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPage: 0
    })
    const [searchQ, setSearchQ] = useState("")
    const debouncedQ = useDebounce(searchQ, 1000)
    const [optionRoles, setOptionRoles] = useState([])
    const [showModal, setShowModal] = useState({
        type: "add",
        add: false,
        update: false,
        delete: false,
    })
    const [idUser, setIdUser] = useState()
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        roleId: null
    })
    const [errors, setErrors] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        roleId: ""
    })

    const fetchMasterData = async() => {
        try {
            setLoading(true)
            const response = await getMasterData("users", pagination.page, pagination.limit, searchQ)
            const resData = response?.data?.data
            const resPagination = response?.data?.pagination
            setUsersData(resData)
            setPagination(resPagination)
        } catch (error) {
            setUsersData([])
            setPagination({
                ...pagination,
                page: 0,
                totalPage: 0
            })
            console.error(error)
        } finally{
            setLoading(false)
        }
    }

    const fetchOptionsRoles = async() => {
        try {
            const response = await getMasterData("roles", "", "", "")
            const options = response?.data?.data?.map((item)=>{
                return{
                    label: item.ROLENAME,
                    value: item.ID
                }
            })
            setOptionRoles(options)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        fetchOptionsRoles()
    }, [])

    useEffect(()=>{
        fetchMasterData()
    }, [pagination.page, pagination.limit, debouncedQ])

    const handleOpenModal = (type, data) => {
        setIdUser(data.ID)
        setForm({
            ...form,
            name: data?.NAME || "",
            username: data?.USERNAME || "",
            email: data?.EMAIL || "",
            roleId: data?.ROLE_ID || null,
            password: "",
            passwordConfirmation: ""
        })
        setShowModal({
            ...showModal,
            type: type,
            [type]: true
        })
    } 

    useEffect(()=>{
        console.log("current form: ", form)
    }, [form])

    const handleCloseModal = (type) => {
        setShowModal({
            ...showModal,
            type: type,
            [type]: false
        })
    }

    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setErrors({
            ...errors,
            [name]: ""
        })
        setForm({ 
            ...form,
            [name]: value
        })
    }

    const handleChangeSelect = (name, value) => {
        setErrors({
            ...errors,
            [name]: ""
        })
        setForm({
            ...form,
            [name]: value
        })
    }

    const clearErrors = () => {
        setErrors({
            name: "",
            username: "",
            email: "",
            password: "",
            passwordConfirmation: "",
            roleId: ""
        })
    }

    const formValidation = () => {
        const errorForm = {}
        const template = " cant't be empty!"

        // Validation on Form Update and Form Add
        if(form.name === ""){
            errorForm.name = "Name" + template
        }
        if(form.username === ""){
            errorForm.username = "Username" + template
        }
        if(form.email === ""){
            errorForm.email = "Email" + template
        }
        if(form.roleId === null){
            errorForm.roleId = "Role" + template
        }

        // Validation on Form Add
        if(showModal.type === "add"){
            if(form.password === ""){
                errorForm.password = "Password" + template
            }
            if(form.passwordConfirmation === ""){
                errorForm.passwordConfirmation = "Password confirmation" + template
            }
            if(form.password !== form.passwordConfirmation){
                errorForm.passwordConfirmation = "Password doesn't match!"
            }
        }

        // If there are errors, return false
        if (Object.keys(errorForm).length > 0) {
            setErrors({...errors, ...errorForm})
            return false;
        }else{
            clearErrors()
            return true;
        }   
    }

    const handleEnter = (e) => {
        if(e.key === "Enter"){
            handleSubmit()
        }
    }

    const handleSubmit = async() => {
        try {
            const isValid = formValidation()
            if(!isValid && showModal.type !== "delete"){
                return
            } 
            let response
            console.log("form: ", form)
            if(showModal.type === "add"){
                response = await createMasterData('user', form)
            }else if(showModal.type === "update"){
                response = await updateMasterDataById('user', idUser, form)
            }else if(showModal.type === "delete"){
                response = await deleteMasterDataById('user', idUser)
            }
            fetchMasterData()
            handleCloseModal(showModal.type)
            console.log("response submit: ", response)
        } catch (error) {
            console.error(error)
        }
    }

    const renderModal = (type, data) => {
        return(
            <Modal
                isOpen={showModal?.[type]}
                onClose={()=>handleCloseModal(type)}
            >
                <Card>
                    <CardHeader>{type==="add" ? "Add" : type==="update" ? "Update" : type==="delete" ? "Delete" : ""} User</CardHeader>
                    <CardContent>
                        {(type==="add" || type==="update") && (
                            <div>
                                <div className='mb-4'>
                                    <label>Name</label>
                                    <Input
                                        placeholder={"Name"}
                                        name={"name"}
                                        onChange={handleChangeInput}
                                        value={form.name}
                                        error={errors?.name !== ""}
                                        hint={errors?.name}
                                        onKeyDown={handleEnter}
                                    />
                                </div>
                                <div className='mb-4'>
                                    <label>Username</label>
                                    <Input
                                        placeholder={"Username"}
                                        name={"username"}
                                        onChange={handleChangeInput}
                                        value={form.username}
                                        error={errors?.username !== ""}
                                        hint={errors?.username}
                                        onKeyDown={handleEnter}
                                        disabled={showModal.type !== "add"}
                                    />
                                </div>
                                <div className='mb-4'>
                                    <label>Email</label>
                                    <Input
                                        placeholder={"Email"}
                                        name={"email"}
                                        onChange={handleChangeInput}
                                        value={form.email}
                                        error={errors?.email !== ""}
                                        hint={errors?.email}
                                        onKeyDown={handleEnter}
                                        disabled={showModal.type !== "add"}
                                    />
                                </div>
                                <div className='mb-4'>
                                    <label>Role</label>
                                    <Select
                                        name='roleId'
                                        options={optionRoles}
                                        defaultValue={form.roleId}
                                        onChange={handleChangeSelect}
                                        error={errors?.roleId !== ""}
                                        hint={errors?.roleId}
                                    />
                                </div>
                                {type === "add" && (
                                    <div>
                                        <div className='mb-4'>
                                            <label>Password</label>
                                            <Input
                                                placeholder={"Password"}
                                                name={"password"}
                                                onChange={handleChangeInput}
                                                value={form.password}
                                                error={errors?.password !== ""}
                                                hint={errors?.password}
                                                onKeyDown={handleEnter}
                                                isPassword={true}
                                            />
                                        </div>
                                        <div className='mb-4'>
                                            <label>Password Confirmation</label>
                                            <Input
                                                placeholder={"Re-type your password"}
                                                name={"passwordConfirmation"}
                                                onChange={handleChangeInput}
                                                value={form.passwordConfirmation}
                                                error={errors?.passwordConfirmation !== ""}
                                                hint={errors?.passwordConfirmation}
                                                onKeyDown={handleEnter}
                                                isPassword={true}
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className='flex items-center justify-end gap-4'>
                                    <Button variant='outline' onClick={()=>handleCloseModal(showModal.type)}>Cancel</Button>
                                    <Button variant='primary' onClick={handleSubmit}>{type==="add" ? "Add" : type==="update" ? "Update" : ""}</Button>
                                </div>
                            </div>
                        )}
                        {type==="delete" && (
                            <div>
                                <h1>Are you sure want to delete user: {data.name}</h1>
                                <div className='flex items-center justify-end gap-4'>
                                    <Button onClick={()=>handleCloseModal(showModal.type)} variant='outline'>Cancel</Button>
                                    <Button onClick={handleSubmit} variant='red'>Delete</Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </Modal>
        )
    }

  return (
    <div className=''>
        <Breadcrumb subPage={"Master"} pageTitle={"Users"}/>

        {/* Render modal */}
        {renderModal(showModal.type, form)}

        {/* Card */}
        <div className='mt-4'>
            <Card>
                <CardContent>
                    {/* Button and Search */}
                    <div className='mb-4 flex justify-between'>
                        <Button onClick={()=>handleOpenModal("add", form)}>Add new</Button>
                        <Input
                            placeholder={"Search"}
                            endIcon={<FontAwesomeIcon icon={faSearch}/>}
                            value={searchQ}
                            onChange={(e)=>setSearchQ(e.target.value)}
                        />
                    </div>
                    <div className='overflow-x-auto'>
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
                                {(usersData.length > 0 && !loading) && usersData.map((item, index)=>{
                                    return(
                                        <TableRow key={index}>
                                            <TableCell>{index+1}</TableCell>
                                            <TableCell>{item.NAME}</TableCell>
                                            <TableCell>{item.USERNAME}</TableCell>
                                            <TableCell>{item.EMAIL}</TableCell>
                                            <TableCell>{item.ROLENAME}</TableCell>
                                            <TableCell>
                                                <div className='flex items-center gap-4'>
                                                    <Button variant='blue' onClick={()=>handleOpenModal("update", item)}><FontAwesomeIcon icon={faEdit}/></Button>
                                                    <Button variant='red' onClick={()=>handleOpenModal("delete", item)}><FontAwesomeIcon icon={faTrash}/></Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                    <LoadingTable data={usersData} loading={loading}/>
                    <div className="mt-4">
                        <Pagination
                            page={pagination.page}
                            totalPage={pagination.totalPage}
                            onPageChange={(e)=>{
                                setPagination({...pagination, page: e})
                            }}
                            showLimit
                            onLimitChange={(e)=>{
                                setPagination({ ...pagination, limit: e, page: 1})
                            }}
                            limit={pagination.limit}
                            options={[10, 25, 50]}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}

export default Users