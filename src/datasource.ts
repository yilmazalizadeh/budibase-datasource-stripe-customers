import { IntegrationBase, SqlQuery } from "@budibase/types"
import Stripe from "stripe"

class CustomIntegration implements IntegrationBase {
  private readonly stripe: Stripe

  constructor(config: { apiKey: string; }) {
    this.stripe = new Stripe(config.apiKey, {
      apiVersion: '2022-08-01'
    })
  }

  async create(query: { 
    address: object,
    description: string,
    email: string,
    metadata: object,
    name: string,
    payment_method: string,
    phone: string,
    shipping: object
   }) {
    return await this.stripe.customers.create(query as Stripe.CustomerCreateParams)
  }

  async read(query: { id: string, email: string, ending_before: string, limit: number, starting_after: string }) {
    if (query.id) {
      return await this.stripe.customers.retrieve(query.id)
    }
    return await this.stripe.customers.list(query)
  }
  async read(query: { limit: number}) {
    return await this.stripe.customers.list(query)
  }
  async update(query: {
    id: string, 
    address: object,
    description: string,
    email: string,
    metadata: object,
    name: string,
    payment_method: string,
    phone: string,
    shipping: object
   }) {
    const { id, ...params } = query
    return await this.stripe.customers.update(id, params as Stripe.CustomerUpdateParams)
  }

  async delete(query: { id: string }) {
    return await this.stripe.customers.del(query.id)
  }

  async search(query: SqlQuery) {
    return await this.stripe.customers.search({
      query: query.sql
    })
  }
}

export default CustomIntegration
