import { api } from '@/adapter'
import store from '@/store';
import { hasError } from '@/utils';

const fetchPicklistInformation = async (query: any): Promise <any>  => {
  return api({
    url: "performFind", 
    method: "post",
    data: query
  });
}

const fetchShipmentInformationForOrder = async(picklistBinId: string, orderId: string): Promise<any> => {
  let shipment = {};
  let shipmentIds = [];

  const params = {
    "entityName": "Shipment",
    "inputFields": {
      "primaryOrderId": orderId,
      "picklistBinId": picklistBinId,
      "originFacilityId": store.state.user.currentFacility.facilityId,
      "statusId": ["SHIPMENT_APPROVED", "SHIPMENT_INPUT"],
      "statusId_op": "in"
    },
    "distinct": "Y"
  }

  try {
    const resp = await api({
      url: "performFind",
      method: "post",
      data: params
    })

    if(resp.status == 200 && !hasError(resp) && resp.data.count) {
      shipment = { ...resp.data.docs[0] } // returning the first shipment record
      shipmentIds = resp.data.docs.map((shipment: any) => shipment.shipmentId) // returning all the shipmentIds as those are used to fetch shipment package information
    }    
  } catch(err) {
    console.error(err)
  }

  return { shipment, shipmentIds };
}

const fetchShipmentPackages = async(shipmentIds: Array<string>): Promise<any> => {
  let shipmentPackageForOrders = {};
  const params = {
    "entityName": "ShipmentPackageRouteSegDetail",
    "inputFields": {
      "shipmentId": shipmentIds,
      "shipmentId_op": "in"
    },
    "fieldList": ["shipmentId", "shipmentPackageSeqId", "shipmentBoxTypeId", "packageName", "primaryOrderId", "carrierPartyId"],
    "viewSize": shipmentIds.length,
    "distinct": "Y"
  }

  try {
    const resp = await api({
      url: "performFind",
      method: "post",
      data: params
    })

    if(resp.status == 200 && !hasError(resp) && resp.data.count) {
      shipmentPackageForOrders = resp.data.docs.reduce((shipmentForOrders: any, shipmentPackage: any) => {
        if(shipmentForOrders[shipmentPackage.primaryOrderId]) {
          shipmentForOrders[shipmentPackage.primaryOrderId].push(shipmentPackage)
        } else {
          shipmentForOrders[shipmentPackage.primaryOrderId] = [shipmentPackage]
        }
        return shipmentForOrders
      }, {})
    }    
  } catch(err) {
    console.error(err)
  }

  return shipmentPackageForOrders;
}

const fetchCarrierPartyIdsForShipment = async(shipmentIds: Array<string>): Promise<any> => {
  let carrierPartyIds = {};
  const params = {
    "entityName": "ShipmentRouteSegment",
    "inputFields": {
      "shipmentId": shipmentIds,
      "shipmentId_op": "in"
    },
    "fieldList": ["carrierPartyId", "shipmentId"],
    "viewSize": shipmentIds.length, // TODO: check about the maximum carriers available for a shipment
  }

  try {
    const resp = await api({
      url: "performFind",
      method: "post",
      data: params
    })

    if(resp.status == 200 && !hasError(resp) && resp.data.count) {
      carrierPartyIds = resp.data.docs.reduce((partyIds: any, shipment: any) => {
        if(partyIds[shipment.shipmentId]) {
          partyIds[shipment.shipmentId].push(shipment)
        } else {
          partyIds[shipment.shipmentId] = [shipment]
        }
        return partyIds
      }, {})
    }    
  } catch(err) {
    console.error(err)
  }

  return carrierPartyIds;
}

const fetchCarrierShipmentBoxType = async(carrierPartyIds: Array<string>): Promise<any> => {
  let shipmentBoxType = {}
  const params = {
    "entityName": "CarrierShipmentBoxType",
    "inputFields": {
      "partyId": carrierPartyIds,
      "partyId_op": "in"
    },
    "fieldList": ["shipmentBoxTypeId", "partyId"],
    "viewSize": carrierPartyIds.length,
  }

  try {
    const resp = await api({
      url: "performFind",
      method: "post",
      data: params
    })

    if(resp.status == 200 && !hasError(resp) && resp.data.count) {
      shipmentBoxType = resp.data.docs.reduce((shipmentBoxTypes: any, boxType: any) => {
        if(shipmentBoxTypes[boxType.partyId]) {
          shipmentBoxTypes[boxType.partyId].push(boxType.shipmentBoxTypeId)
        } else {
          shipmentBoxTypes[boxType.partyId] = [boxType.shipmentBoxTypeId]
        }
        return shipmentBoxTypes
      }, {})
    }    
  } catch(err) {
    console.error(err)
  }

  return shipmentBoxType;
}

const fetchShipmentItemInformation = async(shipmentIds: Array<string>): Promise<any> => {
  let shipmentItemsInformation = {}
  const params = {
    "entityName": "ShipmentAndItemAndProduct",
    "inputFields": {
      "shipmentId": shipmentIds,
      "shipmentId_op": "in"
    },
    "fieldList": ["shipmentItemSeqId", "productId", "primaryOrderId", "shipmentId"],
    "viewSize": shipmentIds.length * 5, // TODO: check what should be the viewSize here
  }

  try {
    const resp = await api({
      url: "performFind",
      method: "post",
      data: params
    })

    if(resp.status == 200 && !hasError(resp) && resp.data.count) {
      shipmentItemsInformation = resp.data.docs.reduce((shipmentItems: any, shipmentItem: any) => {
        if(shipmentItems[shipmentItem.primaryOrderId]) {
          shipmentItems[shipmentItem.primaryOrderId].push(shipmentItem)
        } else {
          shipmentItems[shipmentItem.primaryOrderId] = [shipmentItem]
        }
        return shipmentItems
      }, {})
    }
  } catch(err) {
    console.error(err)
  }

  return shipmentItemsInformation;
}

const fetchShipmentRouteSegmentInformation = async(query: any) : Promise<any> => {
  return api({
    url: "performFind",
    method: "post",
    data: query
  })
}

const fetchDefaultShipmentBox = async(query: any) : Promise<any> => {
  return api({
    url: "performFind",
    method: "post",
    data: query
  })
}

const fetchRejectReasons = async(query: any): Promise<any> => {
  return api({
    url: "performFind",
    method: "post", // TODO: cache this api request
    data: query
  })
}

export const UtilService = {
  fetchCarrierPartyIdsForShipment,
  fetchCarrierShipmentBoxType,
  fetchDefaultShipmentBox,
  fetchPicklistInformation,
  fetchRejectReasons,
  fetchShipmentInformationForOrder,
  fetchShipmentItemInformation,
  fetchShipmentPackages,
  fetchShipmentRouteSegmentInformation
}