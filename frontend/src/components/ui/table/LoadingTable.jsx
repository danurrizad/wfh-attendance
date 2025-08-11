import Spinner from '../spinner/Spinner'

const LoadingTable = ({data, loading}) => {
  return (
    <div className={`flex justify-center items-center ${(data.length === 0 || loading ? "py-10" : "py-2")} `}>
        { (data.length === 0 && !loading) && (
            <p>No data found</p>
        )}
        { (loading) && (
            <div className="w-full h-full flex justify-center items-center gap-2">
                <Spinner/>
            </div>
        )}
    </div>
  )
}

export default LoadingTable