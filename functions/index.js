/* eslint-disable no-undef */

const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { info, error } = require("firebase-functions/logger");
const { setGlobalOptions } = require("firebase-functions/v2");
const { onDocumentUpdated } = require("firebase-functions/v2/firestore");

initializeApp();
const db = getFirestore();

setGlobalOptions({ maxInstances: 10 });

exports.updateVendorActiveItems = onDocumentUpdated(
  "/listing/{listingId}",
  (event) => {
    const newValue = event.data.after.data();
    const previousValue = event.data.before.data();

    // Check if qty or active field has changed
    if (
      (newValue.qty !== previousValue.qty &&
        (newValue.qty === 0 || previousValue.qty === 0)) ||
      newValue.active !== previousValue.active
    ) {
      const vendorId = newValue.vendor;

      // Get the count of active items with qty greater than zero for the vendor
      const activeItemsQuery = db
        .collection("/listing")
        .where("vendor", "==", vendorId)
        .where("active", "==", true)
        .where("qty", ">", 0);

        activeItemsQuery.get().then((snapshot) => {
            const activeItemsCount = snapshot.size;
            
            // Update the corresponding vendor document
            const vendorRef = db.doc(`/vendors/${vendorId}`);
            vendorRef.update({
                activeItems: activeItemsCount,
            }).then (() => {
                info(
                    `Updated activeItems for vendor ${vendorId} to ${activeItemsCount}`,
                );
            }).catch((err) => {
                error("Error updating vendor activeItems:", err);
            });
        }).catch((err) => {
            error("Error updating vendor activeItems:", err);
        });
    }

    return null;
  },
);
