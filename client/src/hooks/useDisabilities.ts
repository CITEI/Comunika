import { useEffect } from 'react'
import { fetchDisabilities } from '../store/auth'
import { useAppDispatch, useAppSelector } from '../store/store'

/**
 * Obtains the list of disabilities from the server.
 */
const useDisabilities = () => {
  const disabilities = useAppSelector((state) => state.auth.disabilities)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (disabilities.length == 0)
      dispatch(fetchDisabilities())
  }, [disabilities])

  return disabilities;
}

export default useDisabilities
