import useUserProgress from './useuserprogress'

/** Gets the user box */
const useBox = () => {
  const progress = useUserProgress()
  return progress?.box || []
}

export default useBox