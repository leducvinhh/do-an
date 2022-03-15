import postApi from './api/postApi'

async function main() {
    try {
        const queryParams = {
            _page: 1,
            _limit: 5,
        }
        const response = await postApi.getAll(queryParams)
        console.log(response)
    } catch (error) {}
    await postApi.update({
        id: 'sktwi1cgkkuif36dk',
        title: 'Vin-cba-2022',
    })
}

main()