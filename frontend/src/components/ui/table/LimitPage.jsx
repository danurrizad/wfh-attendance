import Select from "../../forms/Select"

const LimitPage= ({
    limit,
    onChangeLimit,
    options
}) => {
    const optionsLimit = options.map((opt)=>{
        return{
            label: opt.toString(),
            value: opt.toString(),
        }
    })
    return(
        <div className="w-[75px] py-0">
            <Select
                defaultValue={limit?.toString()}
                options={optionsLimit}
                onChange={(name, value) => onChangeLimit ? onChangeLimit(Number(value)) : ()=>{}}
                showPlaceholder={false}
                className="py-0"
            />
        </div>
    )
}

export default LimitPage