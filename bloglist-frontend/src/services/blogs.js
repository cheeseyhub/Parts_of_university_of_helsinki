import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/blogs'

let token = null
const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const { data } = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return data
}
const removeBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const { data } = await axios.delete(`${baseUrl}/${id}`, config)
  return data
}
export default { getAll, create, update, setToken, removeBlog }
