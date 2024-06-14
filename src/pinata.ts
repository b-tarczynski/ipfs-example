import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const pinataBaseUrl = 'https://api.pinata.cloud'

const authHeaders: HeadersInit = { Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}` }

interface ListResponse {
  rows: {
    date_pinned: Date,
    date_unpinned: Date,
    id: string,
    ipfs_pin_hash: string,
    metadata: {
      name: string
    },
    user_id: string
  }[]
}

export const useFiles = () => {
  return useQuery({
    queryKey: ['pinata', 'files'],
    queryFn: async () => {
      const response = await fetch(`${pinataBaseUrl}/data/pinList`, {
        method: 'GET',
        headers: authHeaders
      })
      const data: ListResponse = await response.json()
      return data
    },
    keepPreviousData: true,
  })
}

const pinataOptions = JSON.stringify({
  cidVersion: 1
})

export const useUploadFile = (onSuccess: () => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData()
      form.append('file', file)
      const metadata = {
        name: file.name,
      }
      form.append('pinataMetadata', JSON.stringify(metadata))
      form.append('pinataOptions', pinataOptions)

      const response = await fetch(`${pinataBaseUrl}/pinning/pinFileToIPFS`, {
        method: 'POST',
        headers: authHeaders,
        body: form,
      })
      return await response.json()
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['pinata', 'files'] })
      onSuccess()
    },
  })
}
