import { Type } from "@prisma/client"
import { Asset } from "./asset"
import { Record } from "./record"

export interface Schedule {
  id: string
  asset_id: string
  date: string
  type: Type
  notes?: string
  asset: Asset
  record: Record | null
}
