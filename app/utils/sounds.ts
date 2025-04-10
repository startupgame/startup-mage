import { Audio } from "expo-av";
import { Platform } from "react-native";

// Sound objects to be loaded and reused
let successSound: Audio.Sound | null = null;
let failureSound: Audio.Sound | null = null;
let coinSound: Audio.Sound | null = null;
let swipeSound: Audio.Sound | null = null;
let goodInvestmentSound: Audio.Sound | null = null;
let badInvestmentSound: Audio.Sound | null = null;
let achievementClaimSound: Audio.Sound | null = null;

// Initialize sounds - call this at app startup
export async function initSounds() {
  try {
    if (Platform.OS === "web") {
      console.log("Sound effects not fully supported on web");
      return;
    }

    // Load all sounds in parallel
    const [
      success,
      failure,
      coin,
      swipe,
      goodInvestment,
      badInvestment,
      achievementClaim,
    ] = await Promise.all([
      Audio.Sound.createAsync(require("../../assets/sounds/success.mp3")),
      Audio.Sound.createAsync(require("../../assets/sounds/failure.mp3")),
      Audio.Sound.createAsync(require("../../assets/sounds/coin.mp3")),
      Audio.Sound.createAsync(require("../../assets/sounds/swipe.mp3")),
      Audio.Sound.createAsync(
        require("../../assets/sounds/good-investment.mp3"),
      ),
      Audio.Sound.createAsync(
        require("../../assets/sounds/bad-investment.mp3"),
      ),
      Audio.Sound.createAsync(
        require("../../assets/sounds/achievement-claim.mp3"),
      ),
    ]);

    successSound = success.sound;
    failureSound = failure.sound;
    coinSound = coin.sound;
    swipeSound = swipe.sound;
    goodInvestmentSound = goodInvestment.sound;
    badInvestmentSound = badInvestment.sound;
    achievementClaimSound = achievementClaim.sound;

    console.log("All sounds loaded successfully");
  } catch (error) {
    console.error("Failed to load sounds:", error);
  }
}

// Clean up sounds when app closes
export async function unloadSounds() {
  try {
    if (successSound) await successSound.unloadAsync();
    if (failureSound) await failureSound.unloadAsync();
    if (coinSound) await coinSound.unloadAsync();
    if (swipeSound) await swipeSound.unloadAsync();
    if (goodInvestmentSound) await goodInvestmentSound.unloadAsync();
    if (badInvestmentSound) await badInvestmentSound.unloadAsync();
    if (achievementClaimSound) await achievementClaimSound.unloadAsync();
  } catch (error) {
    console.error("Error unloading sounds:", error);
  }
}

// Play success sound (for good investment)
export async function playSuccessSound() {
  try {
    if (Platform.OS === "web") return;
    if (goodInvestmentSound) {
      await goodInvestmentSound.setPositionAsync(0);
      await goodInvestmentSound.playAsync();
    }
  } catch (error) {
    console.error("Error playing good investment sound:", error);
  }
}

// Play failure sound (for bad investment)
export async function playFailureSound() {
  try {
    if (Platform.OS === "web") return;
    if (badInvestmentSound) {
      await badInvestmentSound.setPositionAsync(0);
      await badInvestmentSound.playAsync();
    }
  } catch (error) {
    console.error("Error playing bad investment sound:", error);
  }
}

// Play coin sound (for claiming rewards)
export async function playCoinSound() {
  try {
    if (Platform.OS === "web") return;
    if (achievementClaimSound) {
      await achievementClaimSound.setPositionAsync(0);
      await achievementClaimSound.playAsync();
    }
  } catch (error) {
    console.error("Error playing achievement claim sound:", error);
  }
}

// Play swipe sound (for card swipes)
export async function playSwipeSound() {
  try {
    if (Platform.OS === "web") return;
    if (swipeSound) {
      await swipeSound.setPositionAsync(0);
      await swipeSound.playAsync();
    }
  } catch (error) {
    console.error("Error playing swipe sound:", error);
  }
}
