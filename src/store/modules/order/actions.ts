import { ActionTree } from 'vuex'
import RootState from '@/store/RootState'
import OrderState from './OrderState'
import emitter from '@/event-bus'
import { OrderService } from '@/services/OrderService'
import { hasError, showToast } from '@/utils'
import { translate } from '@/i18n'
import * as types from './mutation-types'


const actions: ActionTree<OrderState, RootState> = {

  // get open orders
  async fetchOpenOrders ({ commit, state }, payload) {
    emitter.emit('presentLoader');
    let resp;

    try {
      resp = await OrderService.fetchOpenOrders(payload);
      if (resp.status === 200 && resp.data.grouped.orderId.matches > 0 && !hasError(resp)) {
        const shipmentMethods = state.shipmentMethods.length ? state.shipmentMethods.length < resp.data.facets.shipmentMethodTypeIdFacet.buckets.length ? resp.data.facets.shipmentMethodTypeIdFacet.buckets : state.shipmentMethods : resp.data.facets.shipmentMethodTypeIdFacet.buckets
        commit(types.ORDER_OPEN_UPDATED, {open: resp.data.grouped.orderId.groups, total: resp.data.grouped.orderId.groups.length, shipmentMethods})
        this.dispatch('product/getProductInformation', {orders: resp.data.grouped.orderId.groups})
      } else {
        showToast(translate('Something went wrong'))
      }
    } catch (err) {
      showToast(translate('Something went wrong'))
    } finally {
      emitter.emit('dismissLoader');
    }

    return resp;
  }

}

export default actions;