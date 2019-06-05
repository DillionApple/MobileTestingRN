//
// Created by Dillion Wang on 2019/6/5.
//

#include <jni.h>
#include <stdlib.h>
#include <string.h>

jstring Java_com_mobiletesting_MemoryInjectionModule_startMemoryStress(JNIEnv* env, jobject thiz) {
    int mem_size = 1024 * 1024 * 500;
    char *mem = (char *)malloc(mem_size * sizeof(char));
    for (int i = 0; i < mem_size; ++i) {
        mem[i] = 10;
    }
    return (*env)->NewStringUTF(env, "Success");
}