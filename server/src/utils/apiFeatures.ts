import { NextFunction, Request, RequestHandler } from 'express'
import { Query } from 'mongoose'

type QueryField = 'page' | 'limit' | 'sort' | 'fields'

export interface QueryObj {
  page?: number
  limit?: number
  sort?: string
  fields?: string
}

export interface PaginateProbelmQuery {
  page?: string,
  limit?: string,
  fields: string,
  filter: { [key: string]: any }
}

class ApiFeatures {
  constructor(
    public query: Query<any, any>,
    public queryObj: QueryObj,
  ) {}

  static formatQuery: RequestHandler  = (req: Request, _, next: NextFunction) => {
    let { page, limit, fields } = req.query;
    const excludedFields = ["page", "limit", "fields"];
  
    if(fields) fields = fields.toString().replace(/\,/g, ' ');
    else fields = "-__v";
  
    let filter = { ...req.query };
    excludedFields.forEach((field) => delete filter[field]);
    filter = JSON.parse(JSON.stringify(filter).replace(/\b(lt|gt|lte|gte|eq|ne|all|in|regex)\b/g, (match) => `$${match}`));
    
    req.query = {
      page,
      limit,
      fields,
      filter
    }

    next();
  }

  filter() {
    const excludedFields = ['page', 'limit', 'sort', 'fields']
    let filterObj: QueryObj = { ...this.queryObj }

    excludedFields.forEach((field) => delete filterObj[field as QueryField])

    filterObj = JSON.parse(
      JSON.stringify(filterObj).replace(
        /\b(gte|gt|lt|lte|eq|in)\b/g,
        (match) => `$${match}`,
      ),
    )

    this.query = this.query.find(filterObj)

    return this
  }

  paginate() {
    if (!this.queryObj.limit && !this.queryObj.page) return this

    const page = this.queryObj.page || 1
    const limit = this.queryObj.limit || 100

    this.query = this.query.skip((page - 1) * limit).limit(limit)

    return this
  }

  sort() {
    if (this.queryObj.sort) {
      this.query = this.query.sort(this.queryObj.sort)
    } else {
      this.query = this.query.sort('-createdAt')
    }
    return this
  }

  select() {
    if (this.queryObj.fields) {
      const fields = this.queryObj.fields.replace(/\,/g, ' ')
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-__v')
    }
    return this
  }
}

export default ApiFeatures
