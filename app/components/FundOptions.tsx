import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Modal,
} from "react-native";
import {
  ArrowRight,
  DollarSign,
  Play,
  CreditCard,
  X,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { safeImpact, safeNotification } from "../utils/haptics";
import { safeShowRewardedAd } from "./AdComponents";
import PayPalCheckout from "./PayPalCheckout";

interface FundOptionsProps {
  onWatchAd?: () => void;
  onPurchase?: (amount: number) => void;
  currentBalance?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

const FundOptions = ({
  onWatchAd = () => {},
  onPurchase = () => {},
  currentBalance = 0,
  isOpen = true,
  onClose = () => {},
}: FundOptionsProps) => {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [isLoadingAd, setIsLoadingAd] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentSharkDollars, setPaymentSharkDollars] = useState(0);

  const packages = [
    { id: 1, amount: 500000, price: 1, popular: false },
    { id: 2, amount: 3000000, price: 5, popular: true },
    { id: 3, amount: 7000000, price: 10, bonus: 500, popular: false },
  ];

  const handlePackageSelect = (id: number) => {
    safeImpact(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPackage(id);
  };

  const handlePurchase = () => {
    if (selectedPackage) {
      const pkg = packages.find((p) => p.id === selectedPackage);
      if (pkg) {
        safeImpact(Haptics.ImpactFeedbackStyle.Medium);
        setPaymentAmount(pkg.price);
        setPaymentSharkDollars(pkg.amount);
        setShowPayPal(true);
      }
    }
  };

  const handlePayPalSuccess = (details: any) => {
    console.log("Payment successful:", details);
    safeNotification(Haptics.NotificationFeedbackType.Success);
    setShowPayPal(false);
    onPurchase(paymentSharkDollars);
  };

  const handlePayPalCancel = () => {
    console.log("Payment cancelled");
    setShowPayPal(false);
  };

  const handlePayPalError = (error: any) => {
    console.error("Payment error:", error);
    setShowPayPal(false);
  };

  const handleWatchAd = () => {
    safeImpact(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoadingAd(true);

    // Use interstitial ad instead of rewarded ad
    import("../components/AdComponents")
      .then(({ safeShowInterstitialAd }) => {
        safeShowInterstitialAd(
          () => {
            // Ad closed successfully
            setIsLoadingAd(false);
            onWatchAd();
          },
          () => {
            // Ad failed to load
            setIsLoadingAd(false);
            console.log("Failed to load interstitial ad");
            // Still call onWatchAd to give reward on failure for better UX
            onWatchAd();
          },
        );
      })
      .catch((err) => {
        console.error("Error loading ad module:", err);
        setIsLoadingAd(false);
        onWatchAd();
      });
  };

  if (!isOpen) return null;

  return (
    <View className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
      <View className="bg-slate-800 rounded-3xl p-6 w-full max-w-[350px] shadow-lg">
        <View className="items-center mb-6">
          <Text className="text-2xl font-bold text-white mb-2">
            Out of Shark Dollars!
          </Text>
          <Text className="text-slate-300 text-center">
            Your current balance:{" "}
            <Text className="text-yellow-400 font-bold">
              ${currentBalance.toLocaleString()}
            </Text>
          </Text>
          <Image
            source={{
              uri: "https://api.dicebear.com/7.x/avataaars/svg?seed=shark&backgroundColor=b6e3f4",
            }}
            style={{ width: 80, height: 80 }}
            className="mt-4 rounded-full bg-blue-300"
          />
        </View>

        <View className="mb-6">
          <Text className="text-white font-semibold mb-3">Get more funds:</Text>

          <TouchableOpacity
            className={`flex-row items-center ${isLoadingAd ? "bg-blue-800" : "bg-blue-600"} p-4 rounded-xl mb-4`}
            onPress={handleWatchAd}
            disabled={isLoadingAd}
          >
            <Play size={24} color="white" />
            <View className="ml-3 flex-1">
              <Text className="text-white font-bold">
                {isLoadingAd ? "Loading Ad..." : "Watch an Ad"}
              </Text>
              <Text className="text-blue-200">Get $50,000 Shark Dollars</Text>
            </View>
          </TouchableOpacity>

          <Text className="text-white font-semibold mb-3">
            Or purchase Shark Dollars:
          </Text>

          {packages.map((pkg) => (
            <TouchableOpacity
              key={pkg.id}
              className={`flex-row items-center justify-between p-4 rounded-xl mb-2 ${selectedPackage === pkg.id ? "bg-green-700" : "bg-slate-700"} ${pkg.popular ? "border-2 border-yellow-400" : ""}`}
              onPress={() => handlePackageSelect(pkg.id)}
            >
              <View className="flex-row items-center">
                <DollarSign
                  size={20}
                  color={selectedPackage === pkg.id ? "white" : "#94a3b8"}
                />
                <View className="ml-2">
                  <Text className="text-white font-bold">
                    ${pkg.amount.toLocaleString()} Shark Dollars
                  </Text>
                  {pkg.bonus && (
                    <Text className="text-yellow-400">
                      + {pkg.bonus} bonus points
                    </Text>
                  )}
                </View>
              </View>
              <View className="bg-slate-600 px-3 py-1 rounded-full">
                <Text className="text-white font-bold">${pkg.price}</Text>
              </View>
              {pkg.popular && (
                <View className="absolute -top-2 -right-2 bg-yellow-400 px-2 py-1 rounded-full">
                  <Text className="text-xs font-bold text-slate-800">
                    POPULAR
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row space-x-2">
          <TouchableOpacity
            className="py-4 px-4 rounded-xl items-center justify-center flex-1 bg-slate-600"
            onPress={onClose}
          >
            <Text className="text-white font-bold">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`py-4 px-4 rounded-xl items-center justify-center flex-1 flex-row ${selectedPackage ? "bg-green-500" : "bg-slate-600"}`}
            onPress={handlePurchase}
            disabled={!selectedPackage}
          >
            <Text className="text-white font-bold mr-2">Purchase</Text>
            <ArrowRight size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* PayPal Checkout Modal */}
      <Modal
        visible={showPayPal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPayPal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center p-4">
          <View className="bg-white rounded-2xl overflow-hidden">
            <View className="bg-blue-600 p-4 flex-row justify-between items-center">
              <Text className="text-white text-lg font-bold">
                PayPal Checkout
              </Text>
              <TouchableOpacity onPress={() => setShowPayPal(false)}>
                <X size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View className="p-4">
              <Text className="text-center text-gray-700 mb-4">
                You are purchasing {paymentSharkDollars.toLocaleString()} Shark
                Dollars for ${paymentAmount}
              </Text>

              <View className="h-400 max-h-[400px]">
                <PayPalCheckout
                  amount={paymentAmount}
                  onSuccess={handlePayPalSuccess}
                  onCancel={handlePayPalCancel}
                  onError={handlePayPalError}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FundOptions;
