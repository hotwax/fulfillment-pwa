import { ActionTree } from 'vuex'
import RootState from '@/store/RootState'
import OrderState from './OrderState'
import emitter from '@/event-bus'
import { OrderService } from '@/services/OrderService'
import { hasError } from '@/utils'
import * as types from './mutation-types'
import { prepareOrderQuery } from '@/utils/solrHelper'


const actions: ActionTree<OrderState, RootState> = {

  // get in-progress orders
  async fetchInProgressOrders ({ commit, state }, payload) {
    emitter.emit('presentLoader');
    let resp;

    // preparing filters separately those are based on some condition
    const filters = {} as any
    if(state.selectedPicklists.length) {
      filters['picklistId'] = {value: state.selectedPicklists, op: 'OR'}
    }

    const orderQueryPayload = prepareOrderQuery({
      ...payload,
      viewSize: this.state.util.viewSize,
      queryFields: 'productId productName virtualProductName orderId search_orderIdentifications productSku customerId customerName goodIdentifications',
      sort: 'orderDate asc',
      groupBy: 'picklistBinId',
      filters: {
        picklistItemStatusId: { value: 'PICKITEM_PENDING' },
        '-fulfillmentStatus': { value: 'Rejected' },
        '-shipmentMethodTypeId': { value: 'STOREPICKUP' },
        facilityId: { value: this.state.user.currentFacility.facilityId },
        ...filters
      }
    })

    try {
      resp = await OrderService.fetchInProgressOrders(orderQueryPayload);
      if (resp.status === 200 && resp.data.grouped?.picklistBinId.matches > 0 && !hasError(resp)) {
        const total = resp.data.grouped.picklistBinId.ngroups
        const orders = resp.data.grouped.picklistBinId.groups
        orders.map((order: any) => order.doclist.docs.map((item: any) => {
          // assigning segmentSelected at item level as we have option to change segment for each item
          item.segmentSelected = 'pack'
        }))

        commit(types.ORDER_INPROGRESS_UPDATED, {orders, total})
        this.dispatch('product/getProductInformation', { orders })
      } else {
        console.error('No orders found')
      }
    } catch (err) {
      console.error('error', err)
    }

    emitter.emit('dismissLoader');
    return resp;
  },

  async clearOrders ({ commit }) {
    commit(types.ORDER_INPROGRESS_UPDATED, {orders: {}, total: 0})
  },

  updateSelectedPicklists({ state, commit }, picklistId) {
    const selectedPicklists = JSON.parse(JSON.stringify(state.selectedPicklists))

    if(selectedPicklists.includes(picklistId)) {
      selectedPicklists.splice(selectedPicklists.indexOf(picklistId), 1)
    } else {
      selectedPicklists.push(picklistId)
    }
    commit(types.ORDER_SELECTED_PICKLISTS_UPDATED, selectedPicklists)
  }
}

export default actions;