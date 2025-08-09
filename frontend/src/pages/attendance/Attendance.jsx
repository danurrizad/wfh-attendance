import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../components/ui/breadcrumb/Breadcrumb'
import useAttendanceDataService from '../../services/AttendanceDataService'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table/Table'
import { Card, CardContent } from '../../components/ui/card/Card'

const Attendance = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const { getAttendances } = useAttendanceDataService()
  const [dataAttendances, setDataAttendances] = useState([])

  const fetchAttendances = async() => {
    try {
      const response = await getAttendances()
      console.log("response attendances: ", response?.data?.data)
      setDataAttendances(response?.data?.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(()=>{
    fetchAttendances()
  }, [])


  return (
    <div>
      <Breadcrumb pageTitle={"Attendance"}/>

      <div className='mt-4'>
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Clock In Date</TableCell>
                  <TableCell>Clock In Time</TableCell>
                  <TableCell>Clock Out Date</TableCell>
                  <TableCell>Clock Out Time</TableCell>
                  <TableCell>Image Proof</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataAttendances?.map((item, index)=>{
                  return(
                    <TableRow>
                      <TableCell>{index+1}</TableCell>
                      <TableCell>{item.NAME}</TableCell>
                      <TableCell>{item.CLOCKIN_DATE.split(" ")[0]}</TableCell>
                      <TableCell>{item.CLOCKIN_DATE.split(" ")[1].slice(0, 8)}</TableCell>
                      <TableCell>{""}</TableCell>
                      <TableCell>{""}</TableCell>
                      <TableCell>
                        <img src={`${BACKEND_URL}/${item.IMAGE_PROOF}`} width={200}/>
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

export default Attendance