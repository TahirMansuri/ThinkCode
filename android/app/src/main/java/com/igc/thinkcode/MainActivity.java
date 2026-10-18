package com.igc.thinkcode;

import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    public class WebAppInterface {
        @JavascriptInterface
        public void closeApp() {
            runOnUiThread(() -> finishAffinity());
        }

        @JavascriptInterface
        public boolean isAndroidApp() {
            return true;
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Register custom back press handler using AndroidX OnBackPressedDispatcher.
        // This intercepts Android hardware back button and predictive back swipe gestures.
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (bridge != null && bridge.getWebView() != null) {
                    bridge.getWebView().evaluateJavascript(
                        "if (typeof window.handleAndroidBack === 'function') { window.handleAndroidBack(); } else { window.history.back(); }",
                        null
                    );
                } else {
                    finishAffinity();
                }
            }
        });

        // Register JavaScript interface for closing the app from web view
        setupJsInterface();
    }

    @Override
    public void onStart() {
        super.onStart();
        setupJsInterface();
    }

    @Override
    public void onResume() {
        super.onResume();
        setupJsInterface();
    }

    private void setupJsInterface() {
        if (bridge != null && bridge.getWebView() != null) {
            WebView webView = bridge.getWebView();
            webView.addJavascriptInterface(new WebAppInterface(), "AndroidApp");
        }
    }
}
