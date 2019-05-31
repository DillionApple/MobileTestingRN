package com.mobiletesting;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;

public class MemoryInjectionModule extends ReactContextBaseJavaModule {

    public MemoryInjectionModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "MemoryInjectionModule";
    }

    @ReactMethod
    public void castStress(int size) {
        int[] arr = new int[size];
        for (int i = 0; i < size; i++) {
                arr[i] = i;
        }
    }
}