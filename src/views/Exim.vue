<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-menu-button slot="start" />
        <ion-title>{{ translate('EXIM') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content>
      <section>
        <ion-card>
          <ion-card-header>
            <ion-card-subtitle>
              {{ translate("Export") }}
            </ion-card-subtitle>
            <ion-card-title>
              {{ translate('Packed Orders') }}
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            {{ translate("Export orders that are packed and haven't been shipped yet. Use the exported file to send the packed order details to a carrier where shipping labels and tracking codes will be generated.") }}
          </ion-card-content>
          <div class="border-top">
            <ion-button fill="clear" @click="downloadPackedOrders">
              {{ translate('Export') }}
              <ion-icon slot="end" :icon="downloadOutline" />
            </ion-button>
          </div>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-subtitle>
              {{ translate("Import") }}
            </ion-card-subtitle>
            <ion-card-title>
              {{ translate('Shipped Orders') }}
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            {{ translate('Import shipped order details from an external system based on tracking codes. Orders that have tracking codes will automatically be shipped at the end of the day.') }}
          </ion-card-content>
          <div class="border-top">
            <ion-button fill="clear" @click="uploadImportOrders">
              {{ translate('Import') }}
              <ion-icon slot="end" :icon="cloudUploadOutline" />
            </ion-button>
          </div>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>
              {{ translate('Saved mappings') }}
            </ion-card-title>
          </ion-card-header>
          <div class="border-top">
            <ion-button fill="clear" @click="viewSavedMappings">
              {{ translate('View Saved Mappings') }}
              <ion-icon slot="end" :icon="bookmarkOutline" />
            </ion-button>
          </div>
        </ion-card>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { bookmarkOutline, cloudUploadOutline, downloadOutline  } from 'ionicons/icons'
import { useRouter } from 'vue-router';
import { translate } from '@hotwax/dxp-components';

export default defineComponent({
  name: 'Exim',
  components: {
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonContent,
    IonHeader,
    IonIcon,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar
  },
  methods: {
    uploadImportOrders() {
      this.router.push('/upload-import-orders')
    },
    downloadPackedOrders() {
      this.router.push('/download-packed-orders')
    },
    viewSavedMappings() {
      this.router.push('/saved-mappings')
    }
  },
  setup() {
    const router = useRouter();

    return {
      bookmarkOutline,
      cloudUploadOutline,
      downloadOutline,
      router,
      translate
    }
  }
});
</script>

<style scoped>
section {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  align-items: start;
}

.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
</style>