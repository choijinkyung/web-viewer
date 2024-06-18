import { Dispatch, SetStateAction, useCallback, useState } from "react";
type ReturnTypes<T = any> = [T, (e: any) => void, Dispatch<SetStateAction<T>>]

const useInput = <T=any>(initalData: T): ReturnTypes<T> => {
  const [value, setValue] = useState(initalData);
  const handler = useCallback((event:any) => {
    setValue(event.target.value)
  }, [])
  return [value,handler,setValue]
}

export default useInput