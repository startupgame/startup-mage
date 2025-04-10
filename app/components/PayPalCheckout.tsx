import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Platform } from "react-native";
import { WebView } from "react-native-webview";

interface PayPalCheckoutProps {
  amount: number;
  currency?: string;
  onSuccess: (details: any) => void;
  onCancel: () => void;
  onError: (error: any) => void;
}

const PayPalCheckout: React.FC<PayPalCheckoutProps> = ({
  amount,
  currency = "USD",
  onSuccess,
  onCancel,
  onError,
}) => {
  const [loading, setLoading] = useState(true);

  // PayPal Client ID from environment variables
  const clientId =
    "AXnpa38Q6lU8vh2zidzgl2gYQPtfeT98NmJaZWvV3ccoCoo34xy4qW3-jiSW090ZvQTto4ZP_adqu98Q";

  // Create a simple PayPal checkout page
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PayPal Checkout</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 16px; }
        #paypal-button-container { width: 100%; }
        .loading { display: flex; justify-content: center; padding: 20px; }
      </style>
    </head>
    <body>
      <div id="paypal-button-container"></div>
      
      <script src="https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}"></script>
      <script>
        paypal.Buttons({
          createOrder: function(data, actions) {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: '${amount.toFixed(2)}',
                  currency_code: '${currency}'
                },
                description: 'Shark Dollars Purchase'
              }]
            });
          },
          onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'success',
                details: details
              }));
            });
          },
          onCancel: function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'cancel'
            }));
          },
          onError: function(err) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'error',
              error: err.toString()
            }));
          }
        }).render('#paypal-button-container');
      </script>
    </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      switch (data.type) {
        case "success":
          onSuccess(data.details);
          break;
        case "cancel":
          onCancel();
          break;
        case "error":
          onError(data.error);
          break;
        default:
          console.warn("Unknown message type:", data.type);
      }
    } catch (error) {
      console.error("Failed to parse WebView message:", error);
      onError("Failed to process payment");
    }
  };

  // For web platform, we'll use a different approach
  if (Platform.OS === "web") {
    return (
      <View className="bg-white p-4 rounded-lg">
        <Text className="text-center text-gray-800 mb-4">
          PayPal checkout is not available in web preview. Please use the mobile
          app.
        </Text>
        <ActivityIndicator size="large" color="#0070BA" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white rounded-lg overflow-hidden">
      {loading && (
        <View className="absolute inset-0 bg-white items-center justify-center z-10">
          <ActivityIndicator size="large" color="#0070BA" />
          <Text className="mt-2 text-gray-600">Loading PayPal...</Text>
        </View>
      )}

      <WebView
        source={{ html: htmlContent }}
        onMessage={handleMessage}
        onLoadEnd={() => setLoading(false)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        className="flex-1"
      />
    </View>
  );
};

export default PayPalCheckout;
