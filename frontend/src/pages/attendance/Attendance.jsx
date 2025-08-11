import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../components/ui/breadcrumb/Breadcrumb'
import useAttendanceDataService from '../../services/AttendanceDataService'
import {useDebounce} from '../../hooks/useDebounce'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table/Table'
import { Card, CardContent } from '../../components/ui/card/Card'
import Pagination from '../../components/ui/table/Pagination'
import Input from '../../components/forms/Input'
import LoadingTable from '../../components/ui/table/LoadingTable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import DatePicker from '../../components/forms/DatePicker'

const Attendance = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const [loading, setLoading] = useState(true)
  const { getAttendances } = useAttendanceDataService()
  const [dataAttendances, setDataAttendances] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPage: 0
  })
  const [filter, setFilter] = useState({
    startDate: "",
    endDate: ""
  })
  const [searchQ, setSearchQ] = useState("")
  const debouncedQ = useDebounce(searchQ, 1000)

  const handleChangeRangeDate = (date) => {
    if(date.length === 2){
      setFilter({
        ...filter,
        startDate: new Date(date[0]).toLocaleDateString('en-CA'),
        endDate: new Date(date[1]).toLocaleDateString('en-CA')
      })
    }
  }

  const handleClearRangeDate = () => {
    setFilter({
      ...filter,
      startDate: "",
      endDate: ""
    })
  }

  const fetchAttendances = async() => {
    try {
      setLoading(true)
      const response = await getAttendances(pagination.page, pagination.limit, searchQ, filter.startDate, filter.endDate)
      const resData = response?.data?.data
      const resPagination = response?.data?.pagination
      setDataAttendances(resData)
      setPagination(resPagination)
    } catch (error) {
      setDataAttendances([])
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

  useEffect(()=>{
    fetchAttendances()
  }, [pagination.page, pagination.limit, debouncedQ, filter.startDate, filter.endDate])


  return (
    <div>
      <Breadcrumb pageTitle={"Attendance"}/>

      <div className='mt-4'>
        <Card>
          <CardContent>
            <div className='grid grid-cols-4 mb-3'>
              <div className='col-span-3 flex items-center gap-3'>
                <label>Period</label>
                <DatePicker
                  id='date'
                  mode='range'
                  onChange={handleChangeRangeDate}
                  className='sm:w-[300px]!'
                  placeholder='Select period'
                  isClearable
                  dateFormat="Y-m-d"
                  onClear={handleClearRangeDate}
                  defaultDate={[filter.startDate, filter.endDate]}
                />
              </div>
              <div className='col-span-1'>
                <Input
                  placeholder={"Search"}
                  endIcon={<FontAwesomeIcon icon={faSearch}/>}
                  value={searchQ}
                  onChange={(e)=>setSearchQ(e.target.value)}
                />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Clock In Date</TableCell>
                  <TableCell>Clock In Time</TableCell>
                  <TableCell>Clock In Image Proof</TableCell>
                  <TableCell>Clock Out Date</TableCell>
                  <TableCell>Clock Out Time</TableCell>
                  <TableCell>Clock Out Image Proof</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataAttendances?.map((item, index)=>{
                  return(
                    <TableRow>
                      <TableCell>{index+1}</TableCell>
                      <TableCell>{item?.NAME}</TableCell>
                      <TableCell>{item?.USERNAME}</TableCell>
                      <TableCell>{item?.CLOCKIN_DATE?.split(" ")[0]}</TableCell>
                      <TableCell>{item?.CLOCKIN_DATE?.split(" ")[1].slice(0, 8)}</TableCell>
                      <TableCell>
                        <img src={`${BACKEND_URL}/${item.CLOCKIN_IMAGE_PROOF}`} width={200}/>
                      </TableCell>
                      <TableCell>{item?.CLOCKOUT_DATE?.split(" ")[0]}</TableCell>
                      <TableCell>{item?.CLOCKOUT_DATE?.split(" ")[1].slice(0, 8)}</TableCell>
                      <TableCell>
                        {item.CLOCKOUT_IMAGE_PROOF ? (
                          <img src={`${BACKEND_URL}/${item.CLOCKOUT_IMAGE_PROOF}`} width={200}/>
                        ) : ""}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <LoadingTable data={dataAttendances} loading={loading}/>
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

export default Attendance