//TODO: Code cleaning and optimization required

import NetInfo, {
  NetInfoState,
  NetInfoSubscription,
} from '@react-native-community/netinfo';

class ConnectivityManager {
  private static instance: ConnectivityManager;
  private listeners: Array<(isConnected: boolean) => void> = [];
  private netInfoUnsubscribe: NetInfoSubscription | null = null;
  private _isConnected: boolean = true;

  private constructor() {
    this.setupNetInfoListener();
  }

  public static getInstance(): ConnectivityManager {
    if (!ConnectivityManager.instance) {
      ConnectivityManager.instance = new ConnectivityManager();
    }
    return ConnectivityManager.instance;
  }

  private setupNetInfoListener(): void {
    this.netInfoUnsubscribe = NetInfo.addEventListener(
      this.handleConnectivityChange,
    );

    NetInfo.fetch().then(this.handleConnectivityChange);
  }

  private handleConnectivityChange = (state: NetInfoState): void => {
    const isConnected = Boolean(state.isConnected);

    if (this._isConnected !== isConnected) {
      this._isConnected = isConnected;
      console.log(
        `Network connection state changed: ${
          isConnected ? 'CONNECTED' : 'DISCONNECTED'
        }`,
      );

      this.notifyListeners();
    }
  };

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this._isConnected);
      } catch (error) {
      }
    });
  }

  public addListener(listener: (isConnected: boolean) => void): () => void {
    this.listeners.push(listener);

    setTimeout(() => {
      try {
        listener(this._isConnected);
      } catch (error) {
      }
    }, 0);

    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public isConnected(): boolean {
    return this._isConnected;
  }

  public cleanup(): void {
    if (this.netInfoUnsubscribe) {
      this.netInfoUnsubscribe();
      this.netInfoUnsubscribe = null;
    }
    this.listeners = [];
  }

  public checkConnectivity(): Promise<boolean> {
    return NetInfo.fetch().then(state => Boolean(state.isConnected));
  }
}

export default ConnectivityManager.getInstance();
