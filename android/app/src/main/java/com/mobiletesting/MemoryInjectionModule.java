package com.mobiletesting;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;
import java.util.Random;

public class MemoryInjectionModule extends ReactContextBaseJavaModule {

    static {
        System.loadLibrary("jni_funcs");
    }

    public native String startMemoryStress();

    public MemoryInjectionModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "MemoryInjectionModule";
    }

    @ReactMethod
    public void castStress(int size) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                String ret = startMemoryStress();
                System.out.println(ret);
            }
        }).start();
    }
}