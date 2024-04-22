import { useState } from "react"

const useAppwrite = (fn) => {
   
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      try {
        const response = await getAllPosts()
        setData(response)
      } catch (error) {
        Alert.alert('Error', error.message)
      }finally{
        setIsLoading(false)
      }
    }
  }, [])

  console.log(data);
}