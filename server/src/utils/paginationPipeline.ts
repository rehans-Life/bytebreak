import { Model } from "mongoose";

export interface QueryObj {
        page?: string,
        limit?: string,
        fields: string,
        filter: { [key: string]: any }
}

export const paginationPipeline = (Resource: Model<any>, field: string, { fields, filter, limit, page }: QueryObj) => {
    return Resource.aggregate()
    .match(filter as { [x: string]: any })
    .project(fields as unknown as { [key: string]: any })
    .group({
      _id: "", 
      [field]: { $push: "$$CURRENT" },
      total: { $count: {} }
    })
    .append({ $set: 
      {
          maxPage: { $ceil: { $divide: ["$total", Number(limit)] } }
      }
    })
    .append({ $set: (page && limit) ? {
        [field]: { $slice: [`$${field}`, { $multiply: [ { $subtract: [ { $min: ["$maxPage", Number(page)] }, 1]} , Number(limit) ] }, Number(limit) ] }
      }: {}
    }).project({
      _id: 0
    }).pipeline()
}