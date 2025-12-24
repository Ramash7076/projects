import pincodes from '@/pincodes.json'

export async function GET() {
  
  return Response.json(pincodes)
} 