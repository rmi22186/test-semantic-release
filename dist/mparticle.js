var mParticle = (function () {
    // Base64 encoder/decoder - http://www.webtoolkit.info/javascript_base64.html
    var Base64 = {
      _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
      // Input must be a string
      encode: function encode(input) {
        try {
          if (window.btoa && window.atob) {
            return window.btoa(unescape(encodeURIComponent(input)));
          }
        } catch (e) {
          console.error('Error encoding cookie values into Base64:' + e);
        }

        return this._encode(input);
      },
      _encode: function _encode(input) {
        var output = '';
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = UTF8.encode(input);

        while (i < input.length) {
          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);
          enc1 = chr1 >> 2;
          enc2 = (chr1 & 3) << 4 | chr2 >> 4;
          enc3 = (chr2 & 15) << 2 | chr3 >> 6;
          enc4 = chr3 & 63;

          if (isNaN(chr2)) {
            enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
            enc4 = 64;
          }

          output = output + Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) + Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);
        }

        return output;
      },
      decode: function decode(input) {
        try {
          if (window.btoa && window.atob) {
            return decodeURIComponent(escape(window.atob(input)));
          }
        } catch (e) {//log(e);
        }

        return Base64._decode(input);
      },
      _decode: function _decode(input) {
        var output = '';
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

        while (i < input.length) {
          enc1 = Base64._keyStr.indexOf(input.charAt(i++));
          enc2 = Base64._keyStr.indexOf(input.charAt(i++));
          enc3 = Base64._keyStr.indexOf(input.charAt(i++));
          enc4 = Base64._keyStr.indexOf(input.charAt(i++));
          chr1 = enc1 << 2 | enc2 >> 4;
          chr2 = (enc2 & 15) << 4 | enc3 >> 2;
          chr3 = (enc3 & 3) << 6 | enc4;
          output = output + String.fromCharCode(chr1);

          if (enc3 !== 64) {
            output = output + String.fromCharCode(chr2);
          }

          if (enc4 !== 64) {
            output = output + String.fromCharCode(chr3);
          }
        }

        output = UTF8.decode(output);
        return output;
      }
    };
    var UTF8 = {
      encode: function encode(s) {
        var utftext = '';

        for (var n = 0; n < s.length; n++) {
          var c = s.charCodeAt(n);

          if (c < 128) {
            utftext += String.fromCharCode(c);
          } else if (c > 127 && c < 2048) {
            utftext += String.fromCharCode(c >> 6 | 192);
            utftext += String.fromCharCode(c & 63 | 128);
          } else {
            utftext += String.fromCharCode(c >> 12 | 224);
            utftext += String.fromCharCode(c >> 6 & 63 | 128);
            utftext += String.fromCharCode(c & 63 | 128);
          }
        }

        return utftext;
      },
      decode: function decode(utftext) {
        var s = '';
        var i = 0;
        var c = 0,
            c1 = 0,
            c2 = 0;

        while (i < utftext.length) {
          c = utftext.charCodeAt(i);

          if (c < 128) {
            s += String.fromCharCode(c);
            i++;
          } else if (c > 191 && c < 224) {
            c1 = utftext.charCodeAt(i + 1);
            s += String.fromCharCode((c & 31) << 6 | c1 & 63);
            i += 2;
          } else {
            c1 = utftext.charCodeAt(i + 1);
            c2 = utftext.charCodeAt(i + 2);
            s += String.fromCharCode((c & 15) << 12 | (c1 & 63) << 6 | c2 & 63);
            i += 3;
          }
        }

        return s;
      }
    };
    var Polyfill = {
      // forEach polyfill
      // Production steps of ECMA-262, Edition 5, 15.4.4.18
      // Reference: http://es5.github.io/#x15.4.4.18
      forEach: function forEach(callback, thisArg) {
        var T, k;

        if (this == null) {
          throw new TypeError(' this is null or not defined');
        }

        var O = Object(this);
        var len = O.length >>> 0;

        if (typeof callback !== 'function') {
          throw new TypeError(callback + ' is not a function');
        }

        if (arguments.length > 1) {
          T = thisArg;
        }

        k = 0;

        while (k < len) {
          var kValue;

          if (k in O) {
            kValue = O[k];
            callback.call(T, kValue, k, O);
          }

          k++;
        }
      },
      // map polyfill
      // Production steps of ECMA-262, Edition 5, 15.4.4.19
      // Reference: http://es5.github.io/#x15.4.4.19
      map: function map(callback, thisArg) {
        var T, A, k;

        if (this === null) {
          throw new TypeError(' this is null or not defined');
        }

        var O = Object(this);
        var len = O.length >>> 0;

        if (typeof callback !== 'function') {
          throw new TypeError(callback + ' is not a function');
        }

        if (arguments.length > 1) {
          T = thisArg;
        }

        A = new Array(len);
        k = 0;

        while (k < len) {
          var kValue, mappedValue;

          if (k in O) {
            kValue = O[k];
            mappedValue = callback.call(T, kValue, k, O);
            A[k] = mappedValue;
          }

          k++;
        }

        return A;
      },
      // filter polyfill
      // Prodcution steps of ECMA-262, Edition 5
      // Reference: http://es5.github.io/#x15.4.4.20
      filter: function filter(fun
      /*, thisArg*/
      ) {

        if (this === void 0 || this === null) {
          throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;

        if (typeof fun !== 'function') {
          throw new TypeError();
        }

        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;

        for (var i = 0; i < len; i++) {
          if (i in t) {
            var val = t[i];

            if (fun.call(thisArg, val, i, t)) {
              res.push(val);
            }
          }
        }

        return res;
      },
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
      isArray: function isArray(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
      },
      Base64: Base64
    };

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function unwrapExports (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var defineProperty = createCommonjsModule(function (module) {
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    module.exports = _defineProperty;
    module.exports["default"] = module.exports, module.exports.__esModule = true;
    });

    var _defineProperty = unwrapExports(defineProperty);

    var MessageType = {
      SessionStart: 1,
      SessionEnd: 2,
      PageView: 3,
      PageEvent: 4,
      CrashReport: 5,
      OptOut: 6,
      AppStateTransition: 10,
      Profile: 14,
      Commerce: 16,
      Media: 20,
      UserAttributeChange: 17,
      UserIdentityChange: 18
    };

    var TriggerUploadType = _defineProperty({}, MessageType.Commerce, 1);

    var EventType = {
      Unknown: 0,
      Navigation: 1,
      Location: 2,
      Search: 3,
      Transaction: 4,
      UserContent: 5,
      UserPreference: 6,
      Social: 7,
      Other: 8,
      Media: 9,
      getName: function getName(id) {
        switch (id) {
          case EventType.Unknown:
            return 'Unknown';

          case EventType.Navigation:
            return 'Navigation';

          case EventType.Location:
            return 'Location';

          case EventType.Search:
            return 'Search';

          case EventType.Transaction:
            return 'Transaction';

          case EventType.UserContent:
            return 'User Content';

          case EventType.UserPreference:
            return 'User Preference';

          case EventType.Social:
            return 'Social';

          case CommerceEventType.ProductAddToCart:
            return 'Product Added to Cart';

          case CommerceEventType.ProductAddToWishlist:
            return 'Product Added to Wishlist';

          case CommerceEventType.ProductCheckout:
            return 'Product Checkout';

          case CommerceEventType.ProductCheckoutOption:
            return 'Product Checkout Options';

          case CommerceEventType.ProductClick:
            return 'Product Click';

          case CommerceEventType.ProductImpression:
            return 'Product Impression';

          case CommerceEventType.ProductPurchase:
            return 'Product Purchased';

          case CommerceEventType.ProductRefund:
            return 'Product Refunded';

          case CommerceEventType.ProductRemoveFromCart:
            return 'Product Removed From Cart';

          case CommerceEventType.ProductRemoveFromWishlist:
            return 'Product Removed from Wishlist';

          case CommerceEventType.ProductViewDetail:
            return 'Product View Details';

          case CommerceEventType.PromotionClick:
            return 'Promotion Click';

          case CommerceEventType.PromotionView:
            return 'Promotion View';

          default:
            return 'Other';
        }
      }
    }; // Continuation of enum above, but in seperate object since we don't expose these to end user

    var CommerceEventType = {
      ProductAddToCart: 10,
      ProductRemoveFromCart: 11,
      ProductCheckout: 12,
      ProductCheckoutOption: 13,
      ProductClick: 14,
      ProductViewDetail: 15,
      ProductPurchase: 16,
      ProductRefund: 17,
      PromotionView: 18,
      PromotionClick: 19,
      ProductAddToWishlist: 20,
      ProductRemoveFromWishlist: 21,
      ProductImpression: 22
    };
    var IdentityType = {
      Other: 0,
      CustomerId: 1,
      Facebook: 2,
      Twitter: 3,
      Google: 4,
      Microsoft: 5,
      Yahoo: 6,
      Email: 7,
      FacebookCustomAudienceId: 9,
      Other2: 10,
      Other3: 11,
      Other4: 12,
      Other5: 13,
      Other6: 14,
      Other7: 15,
      Other8: 16,
      Other9: 17,
      Other10: 18,
      MobileNumber: 19,
      PhoneNumber2: 20,
      PhoneNumber3: 21
    };

    IdentityType.isValid = function (identityType) {
      if (typeof identityType === 'number') {
        for (var prop in IdentityType) {
          if (IdentityType.hasOwnProperty(prop)) {
            if (IdentityType[prop] === identityType) {
              return true;
            }
          }
        }
      }

      return false;
    };

    IdentityType.getName = function (identityType) {
      switch (identityType) {
        case window.mParticle.IdentityType.CustomerId:
          return 'Customer ID';

        case window.mParticle.IdentityType.Facebook:
          return 'Facebook ID';

        case window.mParticle.IdentityType.Twitter:
          return 'Twitter ID';

        case window.mParticle.IdentityType.Google:
          return 'Google ID';

        case window.mParticle.IdentityType.Microsoft:
          return 'Microsoft ID';

        case window.mParticle.IdentityType.Yahoo:
          return 'Yahoo ID';

        case window.mParticle.IdentityType.Email:
          return 'Email';

        case window.mParticle.IdentityType.FacebookCustomAudienceId:
          return 'Facebook App User ID';

        default:
          return 'Other ID';
      }
    };

    IdentityType.getIdentityType = function (identityName) {
      switch (identityName) {
        case 'other':
          return IdentityType.Other;

        case 'customerid':
          return IdentityType.CustomerId;

        case 'facebook':
          return IdentityType.Facebook;

        case 'twitter':
          return IdentityType.Twitter;

        case 'google':
          return IdentityType.Google;

        case 'microsoft':
          return IdentityType.Microsoft;

        case 'yahoo':
          return IdentityType.Yahoo;

        case 'email':
          return IdentityType.Email;

        case 'facebookcustomaudienceid':
          return IdentityType.FacebookCustomAudienceId;

        case 'other2':
          return IdentityType.Other2;

        case 'other3':
          return IdentityType.Other3;

        case 'other4':
          return IdentityType.Other4;

        case 'other5':
          return IdentityType.Other5;

        case 'other6':
          return IdentityType.Other6;

        case 'other7':
          return IdentityType.Other7;

        case 'other8':
          return IdentityType.Other8;

        case 'other9':
          return IdentityType.Other9;

        case 'other10':
          return IdentityType.Other10;

        case 'mobile_number':
          return IdentityType.MobileNumber;

        case 'phone_number_2':
          return IdentityType.PhoneNumber2;

        case 'phone_number_3':
          return IdentityType.PhoneNumber3;

        default:
          return false;
      }
    };

    IdentityType.getIdentityName = function (identityType) {
      switch (identityType) {
        case IdentityType.Other:
          return 'other';

        case IdentityType.CustomerId:
          return 'customerid';

        case IdentityType.Facebook:
          return 'facebook';

        case IdentityType.Twitter:
          return 'twitter';

        case IdentityType.Google:
          return 'google';

        case IdentityType.Microsoft:
          return 'microsoft';

        case IdentityType.Yahoo:
          return 'yahoo';

        case IdentityType.Email:
          return 'email';

        case IdentityType.FacebookCustomAudienceId:
          return 'facebookcustomaudienceid';

        case IdentityType.Other2:
          return 'other2';

        case IdentityType.Other3:
          return 'other3';

        case IdentityType.Other4:
          return 'other4';

        case IdentityType.Other5:
          return 'other5';

        case IdentityType.Other6:
          return 'other6';

        case IdentityType.Other7:
          return 'other7';

        case IdentityType.Other8:
          return 'other8';

        case IdentityType.Other9:
          return 'other9';

        case IdentityType.Other10:
          return 'other10';

        case IdentityType.MobileNumber:
          return 'mobile_number';

        case IdentityType.PhoneNumber2:
          return 'phone_number_2';

        case IdentityType.PhoneNumber3:
          return 'phone_number_3';
      }
    };

    var ProductActionType = {
      Unknown: 0,
      AddToCart: 1,
      RemoveFromCart: 2,
      Checkout: 3,
      CheckoutOption: 4,
      Click: 5,
      ViewDetail: 6,
      Purchase: 7,
      Refund: 8,
      AddToWishlist: 9,
      RemoveFromWishlist: 10
    };

    ProductActionType.getName = function (id) {
      switch (id) {
        case ProductActionType.AddToCart:
          return 'Add to Cart';

        case ProductActionType.RemoveFromCart:
          return 'Remove from Cart';

        case ProductActionType.Checkout:
          return 'Checkout';

        case ProductActionType.CheckoutOption:
          return 'Checkout Option';

        case ProductActionType.Click:
          return 'Click';

        case ProductActionType.ViewDetail:
          return 'View Detail';

        case ProductActionType.Purchase:
          return 'Purchase';

        case ProductActionType.Refund:
          return 'Refund';

        case ProductActionType.AddToWishlist:
          return 'Add to Wishlist';

        case ProductActionType.RemoveFromWishlist:
          return 'Remove from Wishlist';

        default:
          return 'Unknown';
      }
    }; // these are the action names used by server and mobile SDKs when expanding a CommerceEvent


    ProductActionType.getExpansionName = function (id) {
      switch (id) {
        case ProductActionType.AddToCart:
          return 'add_to_cart';

        case ProductActionType.RemoveFromCart:
          return 'remove_from_cart';

        case ProductActionType.Checkout:
          return 'checkout';

        case ProductActionType.CheckoutOption:
          return 'checkout_option';

        case ProductActionType.Click:
          return 'click';

        case ProductActionType.ViewDetail:
          return 'view_detail';

        case ProductActionType.Purchase:
          return 'purchase';

        case ProductActionType.Refund:
          return 'refund';

        case ProductActionType.AddToWishlist:
          return 'add_to_wishlist';

        case ProductActionType.RemoveFromWishlist:
          return 'remove_from_wishlist';

        default:
          return 'unknown';
      }
    };

    var PromotionActionType = {
      Unknown: 0,
      PromotionView: 1,
      PromotionClick: 2
    };

    PromotionActionType.getName = function (id) {
      switch (id) {
        case PromotionActionType.PromotionView:
          return 'view';

        case PromotionActionType.PromotionClick:
          return 'click';

        default:
          return 'unknown';
      }
    }; // these are the names that the server and mobile SDKs use while expanding CommerceEvent


    PromotionActionType.getExpansionName = function (id) {
      switch (id) {
        case PromotionActionType.PromotionView:
          return 'view';

        case PromotionActionType.PromotionClick:
          return 'click';

        default:
          return 'unknown';
      }
    };

    var ProfileMessageType = {
      Logout: 3
    };
    var ApplicationTransitionType = {
      AppInit: 1
    };
    var Types = {
      MessageType: MessageType,
      EventType: EventType,
      CommerceEventType: CommerceEventType,
      IdentityType: IdentityType,
      ProfileMessageType: ProfileMessageType,
      ApplicationTransitionType: ApplicationTransitionType,
      ProductActionType: ProductActionType,
      PromotionActionType: PromotionActionType,
      TriggerUploadType: TriggerUploadType
    };

    var version = "1.1.0";

    var Constants = {
      sdkVersion: version,
      sdkVendor: 'mparticle',
      platform: 'web',
      key1: 'value1',
      key2: 'value2',
      Messages: {
        ErrorMessages: {
          NoToken: 'A token must be specified.',
          EventNameInvalidType: 'Event name must be a valid string value.',
          EventDataInvalidType: 'Event data must be a valid object hash.',
          LoggingDisabled: 'Event logging is currently disabled.',
          CookieParseError: 'Could not parse cookie',
          EventEmpty: 'Event object is null or undefined, cancelling send',
          APIRequestEmpty: 'APIRequest is null or undefined, cancelling send',
          NoEventType: 'Event type must be specified.',
          TransactionIdRequired: 'Transaction ID is required',
          TransactionRequired: 'A transaction attributes object is required',
          PromotionIdRequired: 'Promotion ID is required',
          BadAttribute: 'Attribute value cannot be object or array',
          BadKey: 'Key value cannot be object or array',
          BadLogPurchase: 'Transaction attributes and a product are both required to log a purchase, https://docs.mparticle.com/?javascript#measuring-transactions'
        },
        InformationMessages: {
          CookieSearch: 'Searching for cookie',
          CookieFound: 'Cookie found, parsing values',
          CookieNotFound: 'Cookies not found',
          CookieSet: 'Setting cookie',
          CookieSync: 'Performing cookie sync',
          SendBegin: 'Starting to send event',
          SendIdentityBegin: 'Starting to send event to identity server',
          SendWindowsPhone: 'Sending event to Windows Phone container',
          SendIOS: 'Calling iOS path: ',
          SendAndroid: 'Calling Android JS interface method: ',
          SendHttp: 'Sending event to mParticle HTTP service',
          SendAliasHttp: 'Sending alias request to mParticle HTTP service',
          SendIdentityHttp: 'Sending event to mParticle HTTP service',
          StartingNewSession: 'Starting new Session',
          StartingLogEvent: 'Starting to log event',
          StartingLogOptOut: 'Starting to log user opt in/out',
          StartingEndSession: 'Starting to end session',
          StartingInitialization: 'Starting to initialize',
          StartingLogCommerceEvent: 'Starting to log commerce event',
          StartingAliasRequest: 'Starting to Alias MPIDs',
          LoadingConfig: 'Loading configuration options',
          AbandonLogEvent: 'Cannot log event, logging disabled or developer token not set',
          AbandonAliasUsers: 'Cannot Alias Users, logging disabled or developer token not set',
          AbandonStartSession: 'Cannot start session, logging disabled or developer token not set',
          AbandonEndSession: 'Cannot end session, logging disabled or developer token not set',
          NoSessionToEnd: 'Cannot end session, no active session found'
        },
        ValidationMessages: {
          ModifyIdentityRequestUserIdentitiesPresent: 'identityRequests to modify require userIdentities to be present. Request not sent to server. Please fix and try again',
          IdentityRequesetInvalidKey: 'There is an invalid key on your identityRequest object. It can only contain a `userIdentities` object and a `onUserAlias` function. Request not sent to server. Please fix and try again.',
          OnUserAliasType: 'The onUserAlias value must be a function. The onUserAlias provided is of type',
          UserIdentities: 'The userIdentities key must be an object with keys of identityTypes and values of strings. Request not sent to server. Please fix and try again.',
          UserIdentitiesInvalidKey: 'There is an invalid identity key on your `userIdentities` object within the identityRequest. Request not sent to server. Please fix and try again.',
          UserIdentitiesInvalidValues: 'All user identity values must be strings or null. Request not sent to server. Please fix and try again.',
          AliasMissingMpid: 'Alias Request must contain both a destinationMpid and a sourceMpid',
          AliasNonUniqueMpid: "Alias Request's destinationMpid and sourceMpid must be unique",
          AliasMissingTime: 'Alias Request must have both a startTime and an endTime',
          AliasStartBeforeEndTime: "Alias Request's endTime must be later than its startTime"
        }
      },
      NativeSdkPaths: {
        LogEvent: 'logEvent',
        SetUserTag: 'setUserTag',
        RemoveUserTag: 'removeUserTag',
        SetUserAttribute: 'setUserAttribute',
        RemoveUserAttribute: 'removeUserAttribute',
        SetSessionAttribute: 'setSessionAttribute',
        AddToCart: 'addToCart',
        RemoveFromCart: 'removeFromCart',
        ClearCart: 'clearCart',
        LogOut: 'logOut',
        SetUserAttributeList: 'setUserAttributeList',
        RemoveAllUserAttributes: 'removeAllUserAttributes',
        GetUserAttributesLists: 'getUserAttributesLists',
        GetAllUserAttributes: 'getAllUserAttributes',
        Identify: 'identify',
        Logout: 'logout',
        Login: 'login',
        Modify: 'modify',
        Alias: 'aliasUsers',
        Upload: 'upload'
      },
      StorageNames: {
        localStorageName: 'mprtcl-api',
        // Name of the mP localstorage, had cp and pb even if cookies were used, skipped v2
        localStorageNameV3: 'mprtcl-v3',
        // v3 Name of the mP localstorage, final version on SDKv1
        cookieName: 'mprtcl-api',
        // v1 Name of the cookie stored on the user's machine
        cookieNameV2: 'mprtcl-v2',
        // v2 Name of the cookie stored on the user's machine. Removed keys with no values, moved cartProducts and productBags to localStorage.
        cookieNameV3: 'mprtcl-v3',
        // v3 Name of the cookie stored on the user's machine. Base64 encoded keys in Base64CookieKeys object, final version on SDKv1
        localStorageNameV4: 'mprtcl-v4',
        // v4 Name of the mP localstorage, Current Version
        localStorageProductsV4: 'mprtcl-prodv4',
        // The name for mP localstorage that contains products for cartProducs and productBags
        cookieNameV4: 'mprtcl-v4',
        // v4 Name of the cookie stored on the user's machine. Base64 encoded keys in Base64CookieKeys object, current version on SDK v2
        currentStorageName: 'mprtcl-v4',
        currentStorageProductsName: 'mprtcl-prodv4'
      },
      DefaultConfig: {
        cookieDomain: null,
        // If null, defaults to current location.host
        cookieExpiration: 365,
        // Cookie expiration time in days
        logLevel: null,
        // What logging will be provided in the console
        timeout: 300,
        // timeout in milliseconds for logging functions
        sessionTimeout: 30,
        // Session timeout in minutes
        maxProducts: 20,
        // Number of products persisted in cartProducts and productBags
        forwarderStatsTimeout: 5000,
        // Milliseconds for forwarderStats timeout
        integrationDelayTimeout: 5000,
        // Milliseconds for forcing the integration delay to un-suspend event queueing due to integration partner errors
        maxCookieSize: 3000,
        // Number of bytes for cookie size to not exceed
        aliasMaxWindow: 90,
        // Max age of Alias request startTime, in days
        uploadInterval: 0 // Maximum milliseconds in between batch uploads, below 500 will mean immediate upload

      },
      DefaultUrls: {
        v1SecureServiceUrl: 'jssdks.mparticle.com/v1/JS/',
        v2SecureServiceUrl: 'jssdks.mparticle.com/v2/JS/',
        v3SecureServiceUrl: 'jssdks.mparticle.com/v3/JS/',
        configUrl: 'jssdkcdns.mparticle.com/JS/v2/',
        identityUrl: 'identity.mparticle.com/v1/',
        aliasUrl: 'jssdks.mparticle.com/v1/identity/'
      },
      Base64CookieKeys: {
        csm: 1,
        sa: 1,
        ss: 1,
        ua: 1,
        ui: 1,
        csd: 1,
        ia: 1,
        con: 1
      },
      SDKv2NonMPIDCookieKeys: {
        gs: 1,
        cu: 1,
        l: 1,
        globalSettings: 1,
        currentUserMPID: 1
      },
      HTTPCodes: {
        noHttpCoverage: -1,
        activeIdentityRequest: -2,
        activeSession: -3,
        validationIssue: -4,
        nativeIdentityRequest: -5,
        loggingDisabledOrMissingAPIKey: -6,
        tooManyRequests: 429
      },
      FeatureFlags: {
        ReportBatching: 'reportBatching',
        EventsV3: 'eventsV3',
        EventBatchingIntervalMillis: 'eventBatchingIntervalMillis'
      },
      DefaultInstance: 'default_instance'
    };

    var _typeof_1 = createCommonjsModule(function (module) {
    function _typeof(obj) {
      "@babel/helpers - typeof";

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        module.exports = _typeof = function _typeof(obj) {
          return typeof obj;
        };

        module.exports["default"] = module.exports, module.exports.__esModule = true;
      } else {
        module.exports = _typeof = function _typeof(obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };

        module.exports["default"] = module.exports, module.exports.__esModule = true;
      }

      return _typeof(obj);
    }

    module.exports = _typeof;
    module.exports["default"] = module.exports, module.exports.__esModule = true;
    });

    var _typeof = unwrapExports(_typeof_1);

    var setPrototypeOf = createCommonjsModule(function (module) {
    function _setPrototypeOf(o, p) {
      module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };

      module.exports["default"] = module.exports, module.exports.__esModule = true;
      return _setPrototypeOf(o, p);
    }

    module.exports = _setPrototypeOf;
    module.exports["default"] = module.exports, module.exports.__esModule = true;
    });

    unwrapExports(setPrototypeOf);

    var inherits = createCommonjsModule(function (module) {
    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          writable: true,
          configurable: true
        }
      });
      if (superClass) setPrototypeOf(subClass, superClass);
    }

    module.exports = _inherits;
    module.exports["default"] = module.exports, module.exports.__esModule = true;
    });

    var _inherits = unwrapExports(inherits);

    var assertThisInitialized = createCommonjsModule(function (module) {
    function _assertThisInitialized(self) {
      if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return self;
    }

    module.exports = _assertThisInitialized;
    module.exports["default"] = module.exports, module.exports.__esModule = true;
    });

    unwrapExports(assertThisInitialized);

    var possibleConstructorReturn = createCommonjsModule(function (module) {
    var _typeof = _typeof_1["default"];



    function _possibleConstructorReturn(self, call) {
      if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
      }

      return assertThisInitialized(self);
    }

    module.exports = _possibleConstructorReturn;
    module.exports["default"] = module.exports, module.exports.__esModule = true;
    });

    var _possibleConstructorReturn = unwrapExports(possibleConstructorReturn);

    var getPrototypeOf = createCommonjsModule(function (module) {
    function _getPrototypeOf(o) {
      module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
      module.exports["default"] = module.exports, module.exports.__esModule = true;
      return _getPrototypeOf(o);
    }

    module.exports = _getPrototypeOf;
    module.exports["default"] = module.exports, module.exports.__esModule = true;
    });

    var _getPrototypeOf = unwrapExports(getPrototypeOf);

    var arrayLikeToArray = createCommonjsModule(function (module) {
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }

    module.exports = _arrayLikeToArray;
    module.exports["default"] = module.exports, module.exports.__esModule = true;
    });

    unwrapExports(arrayLikeToArray);

    var arrayWithoutHoles = createCommonjsModule(function (module) {
    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) return arrayLikeToArray(arr);
    }

    module.exports = _arrayWithoutHoles;
    module.exports["default"] = module.exports, module.exports.__esModule = true;
    });

    unwrapExports(arrayWithoutHoles);

    var iterableToArray = createCommonjsModule(function (module) {
    function _iterableToArray(iter) {
      if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
    }

    module.exports = _iterableToArray;
    module.exports["default"] = module.exports, module.exports.__esModule = true;
    });

    unwrapExports(iterableToArray);

    var unsupportedIterableToArray = createCommonjsModule(function (module) {
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
    }

    module.exports = _unsupportedIterableToArray;
    module.exports["default"] = module.exports, module.exports.__esModule = true;
    });

    unwrapExports(unsupportedIterableToArray);

    var nonIterableSpread = createCommonjsModule(function (module) {
    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    module.exports = _nonIterableSpread;
    module.exports["default"] = module.exports, module.exports.__esModule = true;
    });

    unwrapExports(nonIterableSpread);

    var toConsumableArray = createCommonjsModule(function (module) {
    function _toConsumableArray(arr) {
      return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
    }

    module.exports = _toConsumableArray;
    module.exports["default"] = module.exports, module.exports.__esModule = true;
    });

    var _toConsumableArray = unwrapExports(toConsumableArray);

    var asyncToGenerator = createCommonjsModule(function (module) {
    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
      try {
        var info = gen[key](arg);
        var value = info.value;
      } catch (error) {
        reject(error);
        return;
      }

      if (info.done) {
        resolve(value);
      } else {
        Promise.resolve(value).then(_next, _throw);
      }
    }

    function _asyncToGenerator(fn) {
      return function () {
        var self = this,
            args = arguments;
        return new Promise(function (resolve, reject) {
          var gen = fn.apply(self, args);

          function _next(value) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
          }

          function _throw(err) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
          }

          _next(undefined);
        });
      };
    }

    module.exports = _asyncToGenerator;
    module.exports["default"] = module.exports, module.exports.__esModule = true;
    });

    var _asyncToGenerator = unwrapExports(asyncToGenerator);

    var classCallCheck = createCommonjsModule(function (module) {
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    module.exports = _classCallCheck;
    module.exports["default"] = module.exports, module.exports.__esModule = true;
    });

    var _classCallCheck = unwrapExports(classCallCheck);

    var createClass = createCommonjsModule(function (module) {
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }

    module.exports = _createClass;
    module.exports["default"] = module.exports, module.exports.__esModule = true;
    });

    var _createClass = unwrapExports(createClass);

    var runtime_1 = createCommonjsModule(function (module) {
    /**
     * Copyright (c) 2014-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    var runtime = (function (exports) {

      var Op = Object.prototype;
      var hasOwn = Op.hasOwnProperty;
      var undefined$1; // More compressible than void 0.
      var $Symbol = typeof Symbol === "function" ? Symbol : {};
      var iteratorSymbol = $Symbol.iterator || "@@iterator";
      var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
      var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

      function define(obj, key, value) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
        return obj[key];
      }
      try {
        // IE 8 has a broken Object.defineProperty that only works on DOM objects.
        define({}, "");
      } catch (err) {
        define = function(obj, key, value) {
          return obj[key] = value;
        };
      }

      function wrap(innerFn, outerFn, self, tryLocsList) {
        // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
        var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
        var generator = Object.create(protoGenerator.prototype);
        var context = new Context(tryLocsList || []);

        // The ._invoke method unifies the implementations of the .next,
        // .throw, and .return methods.
        generator._invoke = makeInvokeMethod(innerFn, self, context);

        return generator;
      }
      exports.wrap = wrap;

      // Try/catch helper to minimize deoptimizations. Returns a completion
      // record like context.tryEntries[i].completion. This interface could
      // have been (and was previously) designed to take a closure to be
      // invoked without arguments, but in all the cases we care about we
      // already have an existing method we want to call, so there's no need
      // to create a new function object. We can even get away with assuming
      // the method takes exactly one argument, since that happens to be true
      // in every case, so we don't have to touch the arguments object. The
      // only additional allocation required is the completion record, which
      // has a stable shape and so hopefully should be cheap to allocate.
      function tryCatch(fn, obj, arg) {
        try {
          return { type: "normal", arg: fn.call(obj, arg) };
        } catch (err) {
          return { type: "throw", arg: err };
        }
      }

      var GenStateSuspendedStart = "suspendedStart";
      var GenStateSuspendedYield = "suspendedYield";
      var GenStateExecuting = "executing";
      var GenStateCompleted = "completed";

      // Returning this object from the innerFn has the same effect as
      // breaking out of the dispatch switch statement.
      var ContinueSentinel = {};

      // Dummy constructor functions that we use as the .constructor and
      // .constructor.prototype properties for functions that return Generator
      // objects. For full spec compliance, you may wish to configure your
      // minifier not to mangle the names of these two functions.
      function Generator() {}
      function GeneratorFunction() {}
      function GeneratorFunctionPrototype() {}

      // This is a polyfill for %IteratorPrototype% for environments that
      // don't natively support it.
      var IteratorPrototype = {};
      IteratorPrototype[iteratorSymbol] = function () {
        return this;
      };

      var getProto = Object.getPrototypeOf;
      var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
      if (NativeIteratorPrototype &&
          NativeIteratorPrototype !== Op &&
          hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
        // This environment has a native %IteratorPrototype%; use it instead
        // of the polyfill.
        IteratorPrototype = NativeIteratorPrototype;
      }

      var Gp = GeneratorFunctionPrototype.prototype =
        Generator.prototype = Object.create(IteratorPrototype);
      GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
      GeneratorFunctionPrototype.constructor = GeneratorFunction;
      GeneratorFunction.displayName = define(
        GeneratorFunctionPrototype,
        toStringTagSymbol,
        "GeneratorFunction"
      );

      // Helper for defining the .next, .throw, and .return methods of the
      // Iterator interface in terms of a single ._invoke method.
      function defineIteratorMethods(prototype) {
        ["next", "throw", "return"].forEach(function(method) {
          define(prototype, method, function(arg) {
            return this._invoke(method, arg);
          });
        });
      }

      exports.isGeneratorFunction = function(genFun) {
        var ctor = typeof genFun === "function" && genFun.constructor;
        return ctor
          ? ctor === GeneratorFunction ||
            // For the native GeneratorFunction constructor, the best we can
            // do is to check its .name property.
            (ctor.displayName || ctor.name) === "GeneratorFunction"
          : false;
      };

      exports.mark = function(genFun) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
        } else {
          genFun.__proto__ = GeneratorFunctionPrototype;
          define(genFun, toStringTagSymbol, "GeneratorFunction");
        }
        genFun.prototype = Object.create(Gp);
        return genFun;
      };

      // Within the body of any async function, `await x` is transformed to
      // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
      // `hasOwn.call(value, "__await")` to determine if the yielded value is
      // meant to be awaited.
      exports.awrap = function(arg) {
        return { __await: arg };
      };

      function AsyncIterator(generator, PromiseImpl) {
        function invoke(method, arg, resolve, reject) {
          var record = tryCatch(generator[method], generator, arg);
          if (record.type === "throw") {
            reject(record.arg);
          } else {
            var result = record.arg;
            var value = result.value;
            if (value &&
                typeof value === "object" &&
                hasOwn.call(value, "__await")) {
              return PromiseImpl.resolve(value.__await).then(function(value) {
                invoke("next", value, resolve, reject);
              }, function(err) {
                invoke("throw", err, resolve, reject);
              });
            }

            return PromiseImpl.resolve(value).then(function(unwrapped) {
              // When a yielded Promise is resolved, its final value becomes
              // the .value of the Promise<{value,done}> result for the
              // current iteration.
              result.value = unwrapped;
              resolve(result);
            }, function(error) {
              // If a rejected Promise was yielded, throw the rejection back
              // into the async generator function so it can be handled there.
              return invoke("throw", error, resolve, reject);
            });
          }
        }

        var previousPromise;

        function enqueue(method, arg) {
          function callInvokeWithMethodAndArg() {
            return new PromiseImpl(function(resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }

          return previousPromise =
            // If enqueue has been called before, then we want to wait until
            // all previous Promises have been resolved before calling invoke,
            // so that results are always delivered in the correct order. If
            // enqueue has not been called before, then it is important to
            // call invoke immediately, without waiting on a callback to fire,
            // so that the async generator function has the opportunity to do
            // any necessary setup in a predictable way. This predictability
            // is why the Promise constructor synchronously invokes its
            // executor callback, and why async functions synchronously
            // execute code before the first await. Since we implement simple
            // async functions in terms of async generators, it is especially
            // important to get this right, even though it requires care.
            previousPromise ? previousPromise.then(
              callInvokeWithMethodAndArg,
              // Avoid propagating failures to Promises returned by later
              // invocations of the iterator.
              callInvokeWithMethodAndArg
            ) : callInvokeWithMethodAndArg();
        }

        // Define the unified helper method that is used to implement .next,
        // .throw, and .return (see defineIteratorMethods).
        this._invoke = enqueue;
      }

      defineIteratorMethods(AsyncIterator.prototype);
      AsyncIterator.prototype[asyncIteratorSymbol] = function () {
        return this;
      };
      exports.AsyncIterator = AsyncIterator;

      // Note that simple async functions are implemented on top of
      // AsyncIterator objects; they just return a Promise for the value of
      // the final result produced by the iterator.
      exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
        if (PromiseImpl === void 0) PromiseImpl = Promise;

        var iter = new AsyncIterator(
          wrap(innerFn, outerFn, self, tryLocsList),
          PromiseImpl
        );

        return exports.isGeneratorFunction(outerFn)
          ? iter // If outerFn is a generator, return the full iterator.
          : iter.next().then(function(result) {
              return result.done ? result.value : iter.next();
            });
      };

      function makeInvokeMethod(innerFn, self, context) {
        var state = GenStateSuspendedStart;

        return function invoke(method, arg) {
          if (state === GenStateExecuting) {
            throw new Error("Generator is already running");
          }

          if (state === GenStateCompleted) {
            if (method === "throw") {
              throw arg;
            }

            // Be forgiving, per 25.3.3.3.3 of the spec:
            // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
            return doneResult();
          }

          context.method = method;
          context.arg = arg;

          while (true) {
            var delegate = context.delegate;
            if (delegate) {
              var delegateResult = maybeInvokeDelegate(delegate, context);
              if (delegateResult) {
                if (delegateResult === ContinueSentinel) continue;
                return delegateResult;
              }
            }

            if (context.method === "next") {
              // Setting context._sent for legacy support of Babel's
              // function.sent implementation.
              context.sent = context._sent = context.arg;

            } else if (context.method === "throw") {
              if (state === GenStateSuspendedStart) {
                state = GenStateCompleted;
                throw context.arg;
              }

              context.dispatchException(context.arg);

            } else if (context.method === "return") {
              context.abrupt("return", context.arg);
            }

            state = GenStateExecuting;

            var record = tryCatch(innerFn, self, context);
            if (record.type === "normal") {
              // If an exception is thrown from innerFn, we leave state ===
              // GenStateExecuting and loop back for another invocation.
              state = context.done
                ? GenStateCompleted
                : GenStateSuspendedYield;

              if (record.arg === ContinueSentinel) {
                continue;
              }

              return {
                value: record.arg,
                done: context.done
              };

            } else if (record.type === "throw") {
              state = GenStateCompleted;
              // Dispatch the exception by looping back around to the
              // context.dispatchException(context.arg) call above.
              context.method = "throw";
              context.arg = record.arg;
            }
          }
        };
      }

      // Call delegate.iterator[context.method](context.arg) and handle the
      // result, either by returning a { value, done } result from the
      // delegate iterator, or by modifying context.method and context.arg,
      // setting context.delegate to null, and returning the ContinueSentinel.
      function maybeInvokeDelegate(delegate, context) {
        var method = delegate.iterator[context.method];
        if (method === undefined$1) {
          // A .throw or .return when the delegate iterator has no .throw
          // method always terminates the yield* loop.
          context.delegate = null;

          if (context.method === "throw") {
            // Note: ["return"] must be used for ES3 parsing compatibility.
            if (delegate.iterator["return"]) {
              // If the delegate iterator has a return method, give it a
              // chance to clean up.
              context.method = "return";
              context.arg = undefined$1;
              maybeInvokeDelegate(delegate, context);

              if (context.method === "throw") {
                // If maybeInvokeDelegate(context) changed context.method from
                // "return" to "throw", let that override the TypeError below.
                return ContinueSentinel;
              }
            }

            context.method = "throw";
            context.arg = new TypeError(
              "The iterator does not provide a 'throw' method");
          }

          return ContinueSentinel;
        }

        var record = tryCatch(method, delegate.iterator, context.arg);

        if (record.type === "throw") {
          context.method = "throw";
          context.arg = record.arg;
          context.delegate = null;
          return ContinueSentinel;
        }

        var info = record.arg;

        if (! info) {
          context.method = "throw";
          context.arg = new TypeError("iterator result is not an object");
          context.delegate = null;
          return ContinueSentinel;
        }

        if (info.done) {
          // Assign the result of the finished delegate to the temporary
          // variable specified by delegate.resultName (see delegateYield).
          context[delegate.resultName] = info.value;

          // Resume execution at the desired location (see delegateYield).
          context.next = delegate.nextLoc;

          // If context.method was "throw" but the delegate handled the
          // exception, let the outer generator proceed normally. If
          // context.method was "next", forget context.arg since it has been
          // "consumed" by the delegate iterator. If context.method was
          // "return", allow the original .return call to continue in the
          // outer generator.
          if (context.method !== "return") {
            context.method = "next";
            context.arg = undefined$1;
          }

        } else {
          // Re-yield the result returned by the delegate method.
          return info;
        }

        // The delegate iterator is finished, so forget it and continue with
        // the outer generator.
        context.delegate = null;
        return ContinueSentinel;
      }

      // Define Generator.prototype.{next,throw,return} in terms of the
      // unified ._invoke helper method.
      defineIteratorMethods(Gp);

      define(Gp, toStringTagSymbol, "Generator");

      // A Generator should always return itself as the iterator object when the
      // @@iterator function is called on it. Some browsers' implementations of the
      // iterator prototype chain incorrectly implement this, causing the Generator
      // object to not be returned from this call. This ensures that doesn't happen.
      // See https://github.com/facebook/regenerator/issues/274 for more details.
      Gp[iteratorSymbol] = function() {
        return this;
      };

      Gp.toString = function() {
        return "[object Generator]";
      };

      function pushTryEntry(locs) {
        var entry = { tryLoc: locs[0] };

        if (1 in locs) {
          entry.catchLoc = locs[1];
        }

        if (2 in locs) {
          entry.finallyLoc = locs[2];
          entry.afterLoc = locs[3];
        }

        this.tryEntries.push(entry);
      }

      function resetTryEntry(entry) {
        var record = entry.completion || {};
        record.type = "normal";
        delete record.arg;
        entry.completion = record;
      }

      function Context(tryLocsList) {
        // The root entry object (effectively a try statement without a catch
        // or a finally block) gives us a place to store values thrown from
        // locations where there is no enclosing try statement.
        this.tryEntries = [{ tryLoc: "root" }];
        tryLocsList.forEach(pushTryEntry, this);
        this.reset(true);
      }

      exports.keys = function(object) {
        var keys = [];
        for (var key in object) {
          keys.push(key);
        }
        keys.reverse();

        // Rather than returning an object with a next method, we keep
        // things simple and return the next function itself.
        return function next() {
          while (keys.length) {
            var key = keys.pop();
            if (key in object) {
              next.value = key;
              next.done = false;
              return next;
            }
          }

          // To avoid creating an additional object, we just hang the .value
          // and .done properties off the next function object itself. This
          // also ensures that the minifier will not anonymize the function.
          next.done = true;
          return next;
        };
      };

      function values(iterable) {
        if (iterable) {
          var iteratorMethod = iterable[iteratorSymbol];
          if (iteratorMethod) {
            return iteratorMethod.call(iterable);
          }

          if (typeof iterable.next === "function") {
            return iterable;
          }

          if (!isNaN(iterable.length)) {
            var i = -1, next = function next() {
              while (++i < iterable.length) {
                if (hasOwn.call(iterable, i)) {
                  next.value = iterable[i];
                  next.done = false;
                  return next;
                }
              }

              next.value = undefined$1;
              next.done = true;

              return next;
            };

            return next.next = next;
          }
        }

        // Return an iterator with no values.
        return { next: doneResult };
      }
      exports.values = values;

      function doneResult() {
        return { value: undefined$1, done: true };
      }

      Context.prototype = {
        constructor: Context,

        reset: function(skipTempReset) {
          this.prev = 0;
          this.next = 0;
          // Resetting context._sent for legacy support of Babel's
          // function.sent implementation.
          this.sent = this._sent = undefined$1;
          this.done = false;
          this.delegate = null;

          this.method = "next";
          this.arg = undefined$1;

          this.tryEntries.forEach(resetTryEntry);

          if (!skipTempReset) {
            for (var name in this) {
              // Not sure about the optimal order of these conditions:
              if (name.charAt(0) === "t" &&
                  hasOwn.call(this, name) &&
                  !isNaN(+name.slice(1))) {
                this[name] = undefined$1;
              }
            }
          }
        },

        stop: function() {
          this.done = true;

          var rootEntry = this.tryEntries[0];
          var rootRecord = rootEntry.completion;
          if (rootRecord.type === "throw") {
            throw rootRecord.arg;
          }

          return this.rval;
        },

        dispatchException: function(exception) {
          if (this.done) {
            throw exception;
          }

          var context = this;
          function handle(loc, caught) {
            record.type = "throw";
            record.arg = exception;
            context.next = loc;

            if (caught) {
              // If the dispatched exception was caught by a catch block,
              // then let that catch block handle the exception normally.
              context.method = "next";
              context.arg = undefined$1;
            }

            return !! caught;
          }

          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            var record = entry.completion;

            if (entry.tryLoc === "root") {
              // Exception thrown outside of any try block that could handle
              // it, so set the completion value of the entire function to
              // throw the exception.
              return handle("end");
            }

            if (entry.tryLoc <= this.prev) {
              var hasCatch = hasOwn.call(entry, "catchLoc");
              var hasFinally = hasOwn.call(entry, "finallyLoc");

              if (hasCatch && hasFinally) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                } else if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }

              } else if (hasCatch) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                }

              } else if (hasFinally) {
                if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }

              } else {
                throw new Error("try statement without catch or finally");
              }
            }
          }
        },

        abrupt: function(type, arg) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.tryLoc <= this.prev &&
                hasOwn.call(entry, "finallyLoc") &&
                this.prev < entry.finallyLoc) {
              var finallyEntry = entry;
              break;
            }
          }

          if (finallyEntry &&
              (type === "break" ||
               type === "continue") &&
              finallyEntry.tryLoc <= arg &&
              arg <= finallyEntry.finallyLoc) {
            // Ignore the finally entry if control is not jumping to a
            // location outside the try/catch block.
            finallyEntry = null;
          }

          var record = finallyEntry ? finallyEntry.completion : {};
          record.type = type;
          record.arg = arg;

          if (finallyEntry) {
            this.method = "next";
            this.next = finallyEntry.finallyLoc;
            return ContinueSentinel;
          }

          return this.complete(record);
        },

        complete: function(record, afterLoc) {
          if (record.type === "throw") {
            throw record.arg;
          }

          if (record.type === "break" ||
              record.type === "continue") {
            this.next = record.arg;
          } else if (record.type === "return") {
            this.rval = this.arg = record.arg;
            this.method = "return";
            this.next = "end";
          } else if (record.type === "normal" && afterLoc) {
            this.next = afterLoc;
          }

          return ContinueSentinel;
        },

        finish: function(finallyLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.finallyLoc === finallyLoc) {
              this.complete(entry.completion, entry.afterLoc);
              resetTryEntry(entry);
              return ContinueSentinel;
            }
          }
        },

        "catch": function(tryLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.tryLoc === tryLoc) {
              var record = entry.completion;
              if (record.type === "throw") {
                var thrown = record.arg;
                resetTryEntry(entry);
              }
              return thrown;
            }
          }

          // The context.catch method must only be called with a location
          // argument that corresponds to a known catch block.
          throw new Error("illegal catch attempt");
        },

        delegateYield: function(iterable, resultName, nextLoc) {
          this.delegate = {
            iterator: values(iterable),
            resultName: resultName,
            nextLoc: nextLoc
          };

          if (this.method === "next") {
            // Deliberately forget the last sent value so that we don't
            // accidentally pass it on to the delegate.
            this.arg = undefined$1;
          }

          return ContinueSentinel;
        }
      };

      // Regardless of whether this script is executing as a CommonJS module
      // or not, return the runtime object so that we can declare the variable
      // regeneratorRuntime in the outer scope, which allows this module to be
      // injected easily by `bin/regenerator --include-runtime script.js`.
      return exports;

    }(
      // If this script is executing as a CommonJS module, use module.exports
      // as the regeneratorRuntime namespace. Otherwise create a new empty
      // object. Either way, the resulting object will be used to initialize
      // the regeneratorRuntime variable at the top of this file.
       module.exports 
    ));

    try {
      regeneratorRuntime = runtime;
    } catch (accidentalStrictMode) {
      // This module should not be running in strict mode, so the above
      // assignment should always work unless something is misconfigured. Just
      // in case runtime.js accidentally runs in strict mode, we can escape
      // strict mode using a global Function call. This could conceivably fail
      // if a Content Security Policy forbids using Function, but in that case
      // the proper solution is to fix the accidental strict mode problem. If
      // you've misconfigured your bundler to force strict mode and applied a
      // CSP to forbid Function, and you're not willing to fix either of those
      // problems, please detail your unique predicament in a GitHub issue.
      Function("r", "regeneratorRuntime = r")(runtime);
    }
    });

    var regenerator = runtime_1;

    var SDKProductActionType;
    (function (SDKProductActionType) {
        SDKProductActionType[SDKProductActionType["Unknown"] = 0] = "Unknown";
        SDKProductActionType[SDKProductActionType["AddToCart"] = 1] = "AddToCart";
        SDKProductActionType[SDKProductActionType["RemoveFromCart"] = 2] = "RemoveFromCart";
        SDKProductActionType[SDKProductActionType["Checkout"] = 3] = "Checkout";
        SDKProductActionType[SDKProductActionType["CheckoutOption"] = 4] = "CheckoutOption";
        SDKProductActionType[SDKProductActionType["Click"] = 5] = "Click";
        SDKProductActionType[SDKProductActionType["ViewDetail"] = 6] = "ViewDetail";
        SDKProductActionType[SDKProductActionType["Purchase"] = 7] = "Purchase";
        SDKProductActionType[SDKProductActionType["Refund"] = 8] = "Refund";
        SDKProductActionType[SDKProductActionType["AddToWishlist"] = 9] = "AddToWishlist";
        SDKProductActionType[SDKProductActionType["RemoveFromWishlist"] = 10] = "RemoveFromWishlist";
    })(SDKProductActionType || (SDKProductActionType = {}));
    var SDKIdentityTypeEnum;
    (function (SDKIdentityTypeEnum) {
        SDKIdentityTypeEnum["other"] = "other";
        SDKIdentityTypeEnum["customerId"] = "customerid";
        SDKIdentityTypeEnum["facebook"] = "facebook";
        SDKIdentityTypeEnum["twitter"] = "twitter";
        SDKIdentityTypeEnum["google"] = "google";
        SDKIdentityTypeEnum["microsoft"] = "microsoft";
        SDKIdentityTypeEnum["yahoo"] = "yahoo";
        SDKIdentityTypeEnum["email"] = "email";
        SDKIdentityTypeEnum["alias"] = "alias";
        SDKIdentityTypeEnum["facebookCustomAudienceId"] = "facebookcustomaudienceid";
        SDKIdentityTypeEnum["otherId2"] = "other2";
        SDKIdentityTypeEnum["otherId3"] = "other3";
        SDKIdentityTypeEnum["otherId4"] = "other4";
        SDKIdentityTypeEnum["otherId5"] = "other5";
        SDKIdentityTypeEnum["otherId6"] = "other6";
        SDKIdentityTypeEnum["otherId7"] = "other7";
        SDKIdentityTypeEnum["otherId8"] = "other8";
        SDKIdentityTypeEnum["otherId9"] = "other9";
        SDKIdentityTypeEnum["otherId10"] = "other10";
        SDKIdentityTypeEnum["mobileNumber"] = "mobile_number";
        SDKIdentityTypeEnum["phoneNumber2"] = "phone_number_2";
        SDKIdentityTypeEnum["phoneNumber3"] = "phone_number_3";
    })(SDKIdentityTypeEnum || (SDKIdentityTypeEnum = {}));

    var dist = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Enum for the os property.
     */
    var ApplicationInformationOsEnum;
    (function (ApplicationInformationOsEnum) {
        ApplicationInformationOsEnum["unknown"] = "Unknown";
        ApplicationInformationOsEnum["iOS"] = "IOS";
        ApplicationInformationOsEnum["android"] = "Android";
        ApplicationInformationOsEnum["windowsPhone"] = "WindowsPhone";
        ApplicationInformationOsEnum["mobileWeb"] = "MobileWeb";
        ApplicationInformationOsEnum["unityIOS"] = "UnityIOS";
        ApplicationInformationOsEnum["unityAndroid"] = "UnityAndroid";
        ApplicationInformationOsEnum["desktop"] = "Desktop";
        ApplicationInformationOsEnum["tvOS"] = "TVOS";
        ApplicationInformationOsEnum["roku"] = "Roku";
        ApplicationInformationOsEnum["outOfBand"] = "OutOfBand";
        ApplicationInformationOsEnum["alexa"] = "Alexa";
        ApplicationInformationOsEnum["smartTV"] = "SmartTV";
        ApplicationInformationOsEnum["fireTV"] = "FireTV";
        ApplicationInformationOsEnum["xbox"] = "Xbox";
    })(ApplicationInformationOsEnum = exports.ApplicationInformationOsEnum || (exports.ApplicationInformationOsEnum = {}));
    /**
     * Enum for the event_type property.
     */
    var ApplicationStateTransitionEventEventTypeEnum;
    (function (ApplicationStateTransitionEventEventTypeEnum) {
        ApplicationStateTransitionEventEventTypeEnum["applicationStateTransition"] = "application_state_transition";
    })(ApplicationStateTransitionEventEventTypeEnum = exports.ApplicationStateTransitionEventEventTypeEnum || (exports.ApplicationStateTransitionEventEventTypeEnum = {}));
    /**
     * Enum for the application_transition_type property.
     */
    var ApplicationStateTransitionEventDataApplicationTransitionTypeEnum;
    (function (ApplicationStateTransitionEventDataApplicationTransitionTypeEnum) {
        ApplicationStateTransitionEventDataApplicationTransitionTypeEnum["applicationInitialized"] = "application_initialized";
        ApplicationStateTransitionEventDataApplicationTransitionTypeEnum["applicationExit"] = "application_exit";
        ApplicationStateTransitionEventDataApplicationTransitionTypeEnum["applicationBackground"] = "application_background";
        ApplicationStateTransitionEventDataApplicationTransitionTypeEnum["applicationForeground"] = "application_foreground";
    })(ApplicationStateTransitionEventDataApplicationTransitionTypeEnum = exports.ApplicationStateTransitionEventDataApplicationTransitionTypeEnum || (exports.ApplicationStateTransitionEventDataApplicationTransitionTypeEnum = {}));
    /**
     * Enum for the environment property.
     */
    var BatchEnvironmentEnum;
    (function (BatchEnvironmentEnum) {
        BatchEnvironmentEnum["unknown"] = "unknown";
        BatchEnvironmentEnum["development"] = "development";
        BatchEnvironmentEnum["production"] = "production";
    })(BatchEnvironmentEnum = exports.BatchEnvironmentEnum || (exports.BatchEnvironmentEnum = {}));
    /**
     * Enum for the event_type property.
     */
    var BreadcrumbEventEventTypeEnum;
    (function (BreadcrumbEventEventTypeEnum) {
        BreadcrumbEventEventTypeEnum["breadcrumb"] = "breadcrumb";
    })(BreadcrumbEventEventTypeEnum = exports.BreadcrumbEventEventTypeEnum || (exports.BreadcrumbEventEventTypeEnum = {}));
    /**
     * Enum for the event_type property.
     */
    var CommerceEventEventTypeEnum;
    (function (CommerceEventEventTypeEnum) {
        CommerceEventEventTypeEnum["commerceEvent"] = "commerce_event";
    })(CommerceEventEventTypeEnum = exports.CommerceEventEventTypeEnum || (exports.CommerceEventEventTypeEnum = {}));
    /**
     * Enum for the custom_event_type property.
     */
    var CommerceEventDataCustomEventTypeEnum;
    (function (CommerceEventDataCustomEventTypeEnum) {
        CommerceEventDataCustomEventTypeEnum["addToCart"] = "add_to_cart";
        CommerceEventDataCustomEventTypeEnum["removeFromCart"] = "remove_from_cart";
        CommerceEventDataCustomEventTypeEnum["checkout"] = "checkout";
        CommerceEventDataCustomEventTypeEnum["checkoutOption"] = "checkout_option";
        CommerceEventDataCustomEventTypeEnum["click"] = "click";
        CommerceEventDataCustomEventTypeEnum["viewDetail"] = "view_detail";
        CommerceEventDataCustomEventTypeEnum["purchase"] = "purchase";
        CommerceEventDataCustomEventTypeEnum["refund"] = "refund";
        CommerceEventDataCustomEventTypeEnum["promotionView"] = "promotion_view";
        CommerceEventDataCustomEventTypeEnum["promotionClick"] = "promotion_click";
        CommerceEventDataCustomEventTypeEnum["addToWishlist"] = "add_to_wishlist";
        CommerceEventDataCustomEventTypeEnum["removeFromWishlist"] = "remove_from_wishlist";
        CommerceEventDataCustomEventTypeEnum["impression"] = "impression";
    })(CommerceEventDataCustomEventTypeEnum = exports.CommerceEventDataCustomEventTypeEnum || (exports.CommerceEventDataCustomEventTypeEnum = {}));
    /**
     * Enum for the event_type property.
     */
    var CrashReportEventEventTypeEnum;
    (function (CrashReportEventEventTypeEnum) {
        CrashReportEventEventTypeEnum["crashReport"] = "crash_report";
    })(CrashReportEventEventTypeEnum = exports.CrashReportEventEventTypeEnum || (exports.CrashReportEventEventTypeEnum = {}));
    /**
     * Enum for the event_type property.
     */
    var CustomEventEventTypeEnum;
    (function (CustomEventEventTypeEnum) {
        CustomEventEventTypeEnum["customEvent"] = "custom_event";
    })(CustomEventEventTypeEnum = exports.CustomEventEventTypeEnum || (exports.CustomEventEventTypeEnum = {}));
    /**
     * Enum for the custom_event_type property.
     */
    var CustomEventDataCustomEventTypeEnum;
    (function (CustomEventDataCustomEventTypeEnum) {
        CustomEventDataCustomEventTypeEnum["navigation"] = "navigation";
        CustomEventDataCustomEventTypeEnum["location"] = "location";
        CustomEventDataCustomEventTypeEnum["search"] = "search";
        CustomEventDataCustomEventTypeEnum["transaction"] = "transaction";
        CustomEventDataCustomEventTypeEnum["userContent"] = "user_content";
        CustomEventDataCustomEventTypeEnum["userPreference"] = "user_preference";
        CustomEventDataCustomEventTypeEnum["social"] = "social";
        CustomEventDataCustomEventTypeEnum["media"] = "media";
        CustomEventDataCustomEventTypeEnum["other"] = "other";
        CustomEventDataCustomEventTypeEnum["unknown"] = "unknown";
    })(CustomEventDataCustomEventTypeEnum = exports.CustomEventDataCustomEventTypeEnum || (exports.CustomEventDataCustomEventTypeEnum = {}));
    /**
     * Enum for the device_orientation property.
     */
    var DeviceCurrentStateDeviceOrientationEnum;
    (function (DeviceCurrentStateDeviceOrientationEnum) {
        DeviceCurrentStateDeviceOrientationEnum["portrait"] = "portrait";
        DeviceCurrentStateDeviceOrientationEnum["portraitUpsideDown"] = "portrait_upside_down";
        DeviceCurrentStateDeviceOrientationEnum["landscape"] = "landscape";
        DeviceCurrentStateDeviceOrientationEnum["landscapeLeft"] = "LandscapeLeft";
        DeviceCurrentStateDeviceOrientationEnum["landscapeRight"] = "LandscapeRight";
        DeviceCurrentStateDeviceOrientationEnum["faceUp"] = "FaceUp";
        DeviceCurrentStateDeviceOrientationEnum["faceDown"] = "FaceDown";
        DeviceCurrentStateDeviceOrientationEnum["square"] = "Square";
    })(DeviceCurrentStateDeviceOrientationEnum = exports.DeviceCurrentStateDeviceOrientationEnum || (exports.DeviceCurrentStateDeviceOrientationEnum = {}));
    /**
     * Enum for the status_bar_orientation property.
     */
    var DeviceCurrentStateStatusBarOrientationEnum;
    (function (DeviceCurrentStateStatusBarOrientationEnum) {
        DeviceCurrentStateStatusBarOrientationEnum["portrait"] = "portrait";
        DeviceCurrentStateStatusBarOrientationEnum["portraitUpsideDown"] = "portrait_upside_down";
        DeviceCurrentStateStatusBarOrientationEnum["landscape"] = "landscape";
        DeviceCurrentStateStatusBarOrientationEnum["landscapeLeft"] = "LandscapeLeft";
        DeviceCurrentStateStatusBarOrientationEnum["landscapeRight"] = "LandscapeRight";
        DeviceCurrentStateStatusBarOrientationEnum["faceUp"] = "FaceUp";
        DeviceCurrentStateStatusBarOrientationEnum["faceDown"] = "FaceDown";
        DeviceCurrentStateStatusBarOrientationEnum["square"] = "Square";
    })(DeviceCurrentStateStatusBarOrientationEnum = exports.DeviceCurrentStateStatusBarOrientationEnum || (exports.DeviceCurrentStateStatusBarOrientationEnum = {}));
    /**
     * Enum for the platform property.
     */
    var DeviceInformationPlatformEnum;
    (function (DeviceInformationPlatformEnum) {
        DeviceInformationPlatformEnum["iOS"] = "iOS";
        DeviceInformationPlatformEnum["android"] = "Android";
        DeviceInformationPlatformEnum["web"] = "web";
        DeviceInformationPlatformEnum["desktop"] = "desktop";
        DeviceInformationPlatformEnum["tvOS"] = "tvOS";
        DeviceInformationPlatformEnum["roku"] = "roku";
        DeviceInformationPlatformEnum["outOfBand"] = "out_of_band";
        DeviceInformationPlatformEnum["smartTV"] = "smart_tv";
        DeviceInformationPlatformEnum["xbox"] = "xbox";
    })(DeviceInformationPlatformEnum = exports.DeviceInformationPlatformEnum || (exports.DeviceInformationPlatformEnum = {}));
    var EventTypeEnum;
    (function (EventTypeEnum) {
        EventTypeEnum["unknown"] = "unknown";
        EventTypeEnum["sessionStart"] = "session_start";
        EventTypeEnum["sessionEnd"] = "session_end";
        EventTypeEnum["screenView"] = "screen_view";
        EventTypeEnum["customEvent"] = "custom_event";
        EventTypeEnum["crashReport"] = "crash_report";
        EventTypeEnum["optOut"] = "opt_out";
        EventTypeEnum["firstRun"] = "first_run";
        EventTypeEnum["preAttribution"] = "pre_attribution";
        EventTypeEnum["pushRegistration"] = "push_registration";
        EventTypeEnum["applicationStateTransition"] = "application_state_transition";
        EventTypeEnum["pushMessage"] = "push_message";
        EventTypeEnum["networkPerformance"] = "network_performance";
        EventTypeEnum["breadcrumb"] = "breadcrumb";
        EventTypeEnum["profile"] = "profile";
        EventTypeEnum["pushReaction"] = "push_reaction";
        EventTypeEnum["commerceEvent"] = "commerce_event";
        EventTypeEnum["userAttributeChange"] = "user_attribute_change";
        EventTypeEnum["userIdentityChange"] = "user_identity_change";
        EventTypeEnum["uninstall"] = "uninstall";
        EventTypeEnum["validationResult"] = "validation_result";
    })(EventTypeEnum = exports.EventTypeEnum || (exports.EventTypeEnum = {}));
    var IdentityTypeEnum;
    (function (IdentityTypeEnum) {
        IdentityTypeEnum["other"] = "other";
        IdentityTypeEnum["customerId"] = "customer_id";
        IdentityTypeEnum["facebook"] = "facebook";
        IdentityTypeEnum["twitter"] = "twitter";
        IdentityTypeEnum["google"] = "google";
        IdentityTypeEnum["microsoft"] = "microsoft";
        IdentityTypeEnum["yahoo"] = "yahoo";
        IdentityTypeEnum["email"] = "email";
        IdentityTypeEnum["alias"] = "alias";
        IdentityTypeEnum["facebookCustomAudienceId"] = "facebook_custom_audience_id";
        IdentityTypeEnum["otherId2"] = "other_id_2";
        IdentityTypeEnum["otherId3"] = "other_id_3";
        IdentityTypeEnum["otherId4"] = "other_id_4";
        IdentityTypeEnum["otherId5"] = "other_id_5";
        IdentityTypeEnum["otherId6"] = "other_id_6";
        IdentityTypeEnum["otherId7"] = "other_id_7";
        IdentityTypeEnum["otherId8"] = "other_id_8";
        IdentityTypeEnum["otherId9"] = "other_id_9";
        IdentityTypeEnum["otherId10"] = "other_id_10";
        IdentityTypeEnum["mobileNumber"] = "mobile_number";
        IdentityTypeEnum["phoneNumber2"] = "phone_number_2";
        IdentityTypeEnum["phoneNumber3"] = "phone_number_3";
    })(IdentityTypeEnum = exports.IdentityTypeEnum || (exports.IdentityTypeEnum = {}));
    /**
     * Enum for the event_type property.
     */
    var NetworkPerformanceEventEventTypeEnum;
    (function (NetworkPerformanceEventEventTypeEnum) {
        NetworkPerformanceEventEventTypeEnum["networkPerformance"] = "network_performance";
    })(NetworkPerformanceEventEventTypeEnum = exports.NetworkPerformanceEventEventTypeEnum || (exports.NetworkPerformanceEventEventTypeEnum = {}));
    /**
     * Enum for the event_type property.
     */
    var OptOutEventEnum;
    (function (OptOutEventEnum) {
        OptOutEventEnum["optOut"] = "opt_out";
    })(OptOutEventEnum = exports.OptOutEventEnum || (exports.OptOutEventEnum = {}));
    /**
     * Enum for the action property.
     */
    var ProductActionActionEnum;
    (function (ProductActionActionEnum) {
        ProductActionActionEnum["unknown"] = "unknown";
        ProductActionActionEnum["addToCart"] = "add_to_cart";
        ProductActionActionEnum["removeFromCart"] = "remove_from_cart";
        ProductActionActionEnum["checkout"] = "checkout";
        ProductActionActionEnum["checkoutOption"] = "checkout_option";
        ProductActionActionEnum["click"] = "click";
        ProductActionActionEnum["viewDetail"] = "view_detail";
        ProductActionActionEnum["purchase"] = "purchase";
        ProductActionActionEnum["refund"] = "refund";
        ProductActionActionEnum["addToWishlist"] = "add_to_wishlist";
        ProductActionActionEnum["removeFromWishlist"] = "remove_from_wish_list";
    })(ProductActionActionEnum = exports.ProductActionActionEnum || (exports.ProductActionActionEnum = {}));
    /**
     * Enum for the event_type property.
     */
    var ProfileEventEventTypeEnum;
    (function (ProfileEventEventTypeEnum) {
        ProfileEventEventTypeEnum["profile"] = "profile";
    })(ProfileEventEventTypeEnum = exports.ProfileEventEventTypeEnum || (exports.ProfileEventEventTypeEnum = {}));
    /**
     * Enum for the profile_event_type property.
     */
    var ProfileEventDataProfileEventTypeEnum;
    (function (ProfileEventDataProfileEventTypeEnum) {
        ProfileEventDataProfileEventTypeEnum["signup"] = "signup";
        ProfileEventDataProfileEventTypeEnum["login"] = "login";
        ProfileEventDataProfileEventTypeEnum["logout"] = "logout";
        ProfileEventDataProfileEventTypeEnum["update"] = "update";
        ProfileEventDataProfileEventTypeEnum["delete"] = "delete";
    })(ProfileEventDataProfileEventTypeEnum = exports.ProfileEventDataProfileEventTypeEnum || (exports.ProfileEventDataProfileEventTypeEnum = {}));
    /**
     * Enum for the action property.
     */
    var PromotionActionActionEnum;
    (function (PromotionActionActionEnum) {
        PromotionActionActionEnum["view"] = "view";
        PromotionActionActionEnum["click"] = "click";
    })(PromotionActionActionEnum = exports.PromotionActionActionEnum || (exports.PromotionActionActionEnum = {}));
    /**
     * Enum for the event_type property.
     */
    var PushMessageEventEventTypeEnum;
    (function (PushMessageEventEventTypeEnum) {
        PushMessageEventEventTypeEnum["pushMessage"] = "push_message";
    })(PushMessageEventEventTypeEnum = exports.PushMessageEventEventTypeEnum || (exports.PushMessageEventEventTypeEnum = {}));
    /**
     * Enum for the push_message_type property.
     */
    var PushMessageEventDataPushMessageTypeEnum;
    (function (PushMessageEventDataPushMessageTypeEnum) {
        PushMessageEventDataPushMessageTypeEnum["sent"] = "sent";
        PushMessageEventDataPushMessageTypeEnum["received"] = "received";
        PushMessageEventDataPushMessageTypeEnum["action"] = "action";
    })(PushMessageEventDataPushMessageTypeEnum = exports.PushMessageEventDataPushMessageTypeEnum || (exports.PushMessageEventDataPushMessageTypeEnum = {}));
    /**
     * Enum for the application_state property.
     */
    var PushMessageEventDataApplicationStateEnum;
    (function (PushMessageEventDataApplicationStateEnum) {
        PushMessageEventDataApplicationStateEnum["notRunning"] = "not_running";
        PushMessageEventDataApplicationStateEnum["background"] = "background";
        PushMessageEventDataApplicationStateEnum["foreground"] = "foreground";
    })(PushMessageEventDataApplicationStateEnum = exports.PushMessageEventDataApplicationStateEnum || (exports.PushMessageEventDataApplicationStateEnum = {}));
    /**
     * Enum for the push_message_behavior property.
     */
    var PushMessageEventDataPushMessageBehaviorEnum;
    (function (PushMessageEventDataPushMessageBehaviorEnum) {
        PushMessageEventDataPushMessageBehaviorEnum["received"] = "Received";
        PushMessageEventDataPushMessageBehaviorEnum["directOpen"] = "DirectOpen";
        PushMessageEventDataPushMessageBehaviorEnum["read"] = "Read";
        PushMessageEventDataPushMessageBehaviorEnum["influencedOpen"] = "InfluencedOpen";
        PushMessageEventDataPushMessageBehaviorEnum["displayed"] = "Displayed";
    })(PushMessageEventDataPushMessageBehaviorEnum = exports.PushMessageEventDataPushMessageBehaviorEnum || (exports.PushMessageEventDataPushMessageBehaviorEnum = {}));
    /**
     * Enum for the event_type property.
     */
    var PushRegistrationEventEventTypeEnum;
    (function (PushRegistrationEventEventTypeEnum) {
        PushRegistrationEventEventTypeEnum["pushRegistration"] = "push_registration";
    })(PushRegistrationEventEventTypeEnum = exports.PushRegistrationEventEventTypeEnum || (exports.PushRegistrationEventEventTypeEnum = {}));
    /**
     * Enum for the event_type property.
     */
    var SessionEndEventEventTypeEnum;
    (function (SessionEndEventEventTypeEnum) {
        SessionEndEventEventTypeEnum["sessionEnd"] = "session_end";
    })(SessionEndEventEventTypeEnum = exports.SessionEndEventEventTypeEnum || (exports.SessionEndEventEventTypeEnum = {}));
    /**
     * Enum for the event_type property.
     */
    var SessionStartEventEventTypeEnum;
    (function (SessionStartEventEventTypeEnum) {
        SessionStartEventEventTypeEnum["sessionStart"] = "session_start";
    })(SessionStartEventEventTypeEnum = exports.SessionStartEventEventTypeEnum || (exports.SessionStartEventEventTypeEnum = {}));
    /**
     * Enum for the channel property.
     */
    var SourceInformationChannelEnum;
    (function (SourceInformationChannelEnum) {
        SourceInformationChannelEnum["native"] = "native";
        SourceInformationChannelEnum["javascript"] = "javascript";
        SourceInformationChannelEnum["pixel"] = "pixel";
        SourceInformationChannelEnum["desktop"] = "desktop";
        SourceInformationChannelEnum["partner"] = "partner";
        SourceInformationChannelEnum["serverToServer"] = "server_to_server";
    })(SourceInformationChannelEnum = exports.SourceInformationChannelEnum || (exports.SourceInformationChannelEnum = {}));
    /**
     * Enum for the event_type property.
     */
    var UserAttributeChangeEventEventTypeEnum;
    (function (UserAttributeChangeEventEventTypeEnum) {
        UserAttributeChangeEventEventTypeEnum["userAttributeChange"] = "user_attribute_change";
    })(UserAttributeChangeEventEventTypeEnum = exports.UserAttributeChangeEventEventTypeEnum || (exports.UserAttributeChangeEventEventTypeEnum = {}));
    /**
     * Enum for the event_type property.
     */
    var UserIdentityChangeEventEventTypeEnum;
    (function (UserIdentityChangeEventEventTypeEnum) {
        UserIdentityChangeEventEventTypeEnum["userIdentityChange"] = "user_identity_change";
    })(UserIdentityChangeEventEventTypeEnum = exports.UserIdentityChangeEventEventTypeEnum || (exports.UserIdentityChangeEventEventTypeEnum = {}));
    });

    unwrapExports(dist);
    var dist_1 = dist.ApplicationInformationOsEnum;
    var dist_2 = dist.ApplicationStateTransitionEventEventTypeEnum;
    var dist_3 = dist.ApplicationStateTransitionEventDataApplicationTransitionTypeEnum;
    var dist_4 = dist.BatchEnvironmentEnum;
    var dist_5 = dist.BreadcrumbEventEventTypeEnum;
    var dist_6 = dist.CommerceEventEventTypeEnum;
    var dist_7 = dist.CommerceEventDataCustomEventTypeEnum;
    var dist_8 = dist.CrashReportEventEventTypeEnum;
    var dist_9 = dist.CustomEventEventTypeEnum;
    var dist_10 = dist.CustomEventDataCustomEventTypeEnum;
    var dist_11 = dist.DeviceCurrentStateDeviceOrientationEnum;
    var dist_12 = dist.DeviceCurrentStateStatusBarOrientationEnum;
    var dist_13 = dist.DeviceInformationPlatformEnum;
    var dist_14 = dist.EventTypeEnum;
    var dist_15 = dist.IdentityTypeEnum;
    var dist_16 = dist.NetworkPerformanceEventEventTypeEnum;
    var dist_17 = dist.OptOutEventEnum;
    var dist_18 = dist.ProductActionActionEnum;
    var dist_19 = dist.ProfileEventEventTypeEnum;
    var dist_20 = dist.ProfileEventDataProfileEventTypeEnum;
    var dist_21 = dist.PromotionActionActionEnum;
    var dist_22 = dist.PushMessageEventEventTypeEnum;
    var dist_23 = dist.PushMessageEventDataPushMessageTypeEnum;
    var dist_24 = dist.PushMessageEventDataApplicationStateEnum;
    var dist_25 = dist.PushMessageEventDataPushMessageBehaviorEnum;
    var dist_26 = dist.PushRegistrationEventEventTypeEnum;
    var dist_27 = dist.SessionEndEventEventTypeEnum;
    var dist_28 = dist.SessionStartEventEventTypeEnum;
    var dist_29 = dist.SourceInformationChannelEnum;
    var dist_30 = dist.UserAttributeChangeEventEventTypeEnum;
    var dist_31 = dist.UserIdentityChangeEventEventTypeEnum;

    function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
            symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; });
        keys.push.apply(keys, symbols);
    } return keys; }
    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); });
        }
        else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        }
        else {
            ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); });
        }
    } return target; }
    function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
            if (it)
                o = it;
            var i = 0;
            var F = function F() { };
            return { s: F, n: function n() { if (i >= o.length)
                    return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try {
            if (!normalCompletion && it["return"] != null)
                it["return"]();
        }
        finally {
            if (didErr)
                throw err;
        } } }; }
    function _unsupportedIterableToArray(o, minLen) { if (!o)
        return; if (typeof o === "string")
        return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor)
        n = o.constructor.name; if (n === "Map" || n === "Set")
        return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray(o, minLen); }
    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length)
        len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
    } return arr2; }
    function convertEvents(mpid, sdkEvents, mpInstance) {
        if (!mpid) {
            return null;
        }
        if (!sdkEvents || sdkEvents.length < 1) {
            return null;
        }
        var uploadEvents = [];
        var lastEvent = null;
        var _iterator = _createForOfIteratorHelper(sdkEvents), _step;
        try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var sdkEvent = _step.value;
                if (sdkEvent) {
                    lastEvent = sdkEvent;
                    var baseEvent = convertEvent(sdkEvent);
                    if (baseEvent) {
                        uploadEvents.push(baseEvent);
                    }
                }
            }
        }
        catch (err) {
            _iterator.e(err);
        }
        finally {
            _iterator.f();
        }
        if (!lastEvent) {
            return null;
        }
        var upload = {
            source_request_id: mpInstance._Helpers.generateUniqueId(),
            mpid: mpid,
            timestamp_unixtime_ms: new Date().getTime(),
            environment: lastEvent.Debug ? dist_4.development : dist_4.production,
            events: uploadEvents,
            mp_deviceid: lastEvent.DeviceId,
            sdk_version: lastEvent.SDKVersion,
            application_info: {
                application_version: lastEvent.AppVersion,
                application_name: lastEvent.AppName
            },
            device_info: {
                platform: dist_13.web,
                screen_width: window.screen.width,
                screen_height: window.screen.height
            },
            user_attributes: lastEvent.UserAttributes,
            user_identities: convertUserIdentities(lastEvent.UserIdentities),
            consent_state: convertConsentState(lastEvent.ConsentState),
            integration_attributes: lastEvent.IntegrationAttributes
        };
        if (lastEvent.DataPlan && lastEvent.DataPlan.PlanId) {
            upload.context = {
                data_plan: {
                    plan_id: lastEvent.DataPlan.PlanId,
                    plan_version: lastEvent.DataPlan.PlanVersion || undefined
                }
            };
        }
        return upload;
    }
    function convertConsentState(sdkConsentState) {
        if (!sdkConsentState) {
            return null;
        }
        var consentState = {
            gdpr: convertGdprConsentState(sdkConsentState.getGDPRConsentState()),
            ccpa: convertCcpaConsentState(sdkConsentState.getCCPAConsentState())
        };
        return consentState;
    }
    function convertGdprConsentState(sdkGdprConsentState) {
        if (!sdkGdprConsentState) {
            return null;
        }
        var state = {};
        for (var purpose in sdkGdprConsentState) {
            if (sdkGdprConsentState.hasOwnProperty(purpose)) {
                state[purpose] = {
                    consented: sdkGdprConsentState[purpose].Consented,
                    hardware_id: sdkGdprConsentState[purpose].HardwareId,
                    document: sdkGdprConsentState[purpose].ConsentDocument,
                    timestamp_unixtime_ms: sdkGdprConsentState[purpose].Timestamp,
                    location: sdkGdprConsentState[purpose].Location
                };
            }
        }
        return state;
    }
    function convertCcpaConsentState(sdkCcpaConsentState) {
        if (!sdkCcpaConsentState) {
            return null;
        }
        var state = {
            data_sale_opt_out: {
                consented: sdkCcpaConsentState.Consented,
                hardware_id: sdkCcpaConsentState.HardwareId,
                document: sdkCcpaConsentState.ConsentDocument,
                timestamp_unixtime_ms: sdkCcpaConsentState.Timestamp,
                location: sdkCcpaConsentState.Location
            }
        };
        return state;
    }
    function convertUserIdentities(sdkUserIdentities) {
        if (!sdkUserIdentities || !sdkUserIdentities.length) {
            return null;
        }
        var batchIdentities = {};
        var _iterator2 = _createForOfIteratorHelper(sdkUserIdentities), _step2;
        try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var identity = _step2.value;
                switch (identity.Type) {
                    case Types.IdentityType.CustomerId:
                        batchIdentities.customer_id = identity.Identity;
                        break;
                    case Types.IdentityType.Email:
                        batchIdentities.email = identity.Identity;
                        break;
                    case Types.IdentityType.Facebook:
                        batchIdentities.facebook = identity.Identity;
                        break;
                    case Types.IdentityType.FacebookCustomAudienceId:
                        batchIdentities.facebook_custom_audience_id = identity.Identity;
                        break;
                    case Types.IdentityType.Google:
                        batchIdentities.google = identity.Identity;
                        break;
                    case Types.IdentityType.Microsoft:
                        batchIdentities.microsoft = identity.Identity;
                        break;
                    case Types.IdentityType.Other:
                        batchIdentities.other = identity.Identity;
                        break;
                    case Types.IdentityType.Other2:
                        batchIdentities.other_id_2 = identity.Identity;
                        break;
                    case Types.IdentityType.Other3:
                        batchIdentities.other_id_3 = identity.Identity;
                        break;
                    case Types.IdentityType.Other4:
                        batchIdentities.other_id_4 = identity.Identity;
                        break;
                    case Types.IdentityType.Other5:
                        batchIdentities.other_id_5 = identity.Identity;
                        break;
                    case Types.IdentityType.Other6:
                        batchIdentities.other_id_6 = identity.Identity;
                        break;
                    case Types.IdentityType.Other7:
                        batchIdentities.other_id_7 = identity.Identity;
                        break;
                    case Types.IdentityType.Other8:
                        batchIdentities.other_id_8 = identity.Identity;
                        break;
                    case Types.IdentityType.Other9:
                        batchIdentities.other_id_9 = identity.Identity;
                        break;
                    case Types.IdentityType.Other10:
                        batchIdentities.other_id_10 = identity.Identity;
                        break;
                    case Types.IdentityType.MobileNumber:
                        batchIdentities.mobile_number = identity.Identity;
                        break;
                    case Types.IdentityType.PhoneNumber2:
                        batchIdentities.phone_number_2 = identity.Identity;
                        break;
                    case Types.IdentityType.PhoneNumber3:
                        batchIdentities.phone_number_3 = identity.Identity;
                        break;
                    default:
                        break;
                }
            }
        }
        catch (err) {
            _iterator2.e(err);
        }
        finally {
            _iterator2.f();
        }
        return batchIdentities;
    }
    function convertEvent(sdkEvent) {
        if (!sdkEvent) {
            return null;
        }
        switch (sdkEvent.EventDataType) {
            case Types.MessageType.AppStateTransition:
                return convertAST(sdkEvent);
            case Types.MessageType.Commerce:
                return convertCommerceEvent(sdkEvent);
            case Types.MessageType.CrashReport:
                return convertCrashReportEvent(sdkEvent);
            case Types.MessageType.OptOut:
                return convertOptOutEvent(sdkEvent);
            case Types.MessageType.PageEvent:
                // Note: Media Events are also sent as PageEvents/CustomEvents
                return convertCustomEvent(sdkEvent);
            case Types.MessageType.PageView:
                return convertPageViewEvent(sdkEvent);
            case Types.MessageType.Profile:
                //deprecated and not supported by the web SDK
                return null;
            case Types.MessageType.SessionEnd:
                return convertSessionEndEvent(sdkEvent);
            case Types.MessageType.SessionStart:
                return convertSessionStartEvent(sdkEvent);
            case Types.MessageType.UserAttributeChange:
                return convertUserAttributeChangeEvent(sdkEvent);
            case Types.MessageType.UserIdentityChange:
                return convertUserIdentityChangeEvent(sdkEvent);
        }
        return null;
    }
    function convertProductActionType(actionType) {
        if (!actionType) {
            return dist_18.unknown;
        }
        switch (actionType) {
            case SDKProductActionType.AddToCart:
                return dist_18.addToCart;
            case SDKProductActionType.AddToWishlist:
                return dist_18.addToWishlist;
            case SDKProductActionType.Checkout:
                return dist_18.checkout;
            case SDKProductActionType.CheckoutOption:
                return dist_18.checkoutOption;
            case SDKProductActionType.Click:
                return dist_18.click;
            case SDKProductActionType.Purchase:
                return dist_18.purchase;
            case SDKProductActionType.Refund:
                return dist_18.refund;
            case SDKProductActionType.RemoveFromCart:
                return dist_18.removeFromCart;
            case SDKProductActionType.RemoveFromWishlist:
                return dist_18.removeFromWishlist;
            case SDKProductActionType.ViewDetail:
                return dist_18.viewDetail;
            default:
                return dist_18.unknown;
        }
    }
    function convertProductAction(sdkEvent) {
        if (!sdkEvent.ProductAction) {
            return null;
        }
        var productAction = {
            action: convertProductActionType(sdkEvent.ProductAction.ProductActionType),
            checkout_step: sdkEvent.ProductAction.CheckoutStep,
            checkout_options: sdkEvent.ProductAction.CheckoutOptions,
            transaction_id: sdkEvent.ProductAction.TransactionId,
            affiliation: sdkEvent.ProductAction.Affiliation,
            total_amount: sdkEvent.ProductAction.TotalAmount,
            tax_amount: sdkEvent.ProductAction.TaxAmount,
            shipping_amount: sdkEvent.ProductAction.ShippingAmount,
            coupon_code: sdkEvent.ProductAction.CouponCode,
            products: convertProducts(sdkEvent.ProductAction.ProductList)
        };
        return productAction;
    }
    function convertProducts(sdkProducts) {
        if (!sdkProducts || !sdkProducts.length) {
            return null;
        }
        var products = [];
        var _iterator3 = _createForOfIteratorHelper(sdkProducts), _step3;
        try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var sdkProduct = _step3.value;
                var product = {
                    id: sdkProduct.Sku,
                    name: sdkProduct.Name,
                    brand: sdkProduct.Brand,
                    category: sdkProduct.Category,
                    variant: sdkProduct.Variant,
                    total_product_amount: sdkProduct.TotalAmount,
                    position: sdkProduct.Position,
                    price: sdkProduct.Price,
                    quantity: sdkProduct.Quantity,
                    coupon_code: sdkProduct.CouponCode,
                    custom_attributes: sdkProduct.Attributes
                };
                products.push(product);
            }
        }
        catch (err) {
            _iterator3.e(err);
        }
        finally {
            _iterator3.f();
        }
        return products;
    }
    function convertPromotionAction(sdkEvent) {
        if (!sdkEvent.PromotionAction) {
            return null;
        }
        var promotionAction = {
            action: sdkEvent.PromotionAction.PromotionActionType,
            promotions: convertPromotions(sdkEvent.PromotionAction.PromotionList)
        };
        return promotionAction;
    }
    function convertPromotions(sdkPromotions) {
        if (!sdkPromotions || !sdkPromotions.length) {
            return null;
        }
        var promotions = [];
        var _iterator4 = _createForOfIteratorHelper(sdkPromotions), _step4;
        try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                var sdkPromotion = _step4.value;
                var promotion = {
                    id: sdkPromotion.Id,
                    name: sdkPromotion.Name,
                    creative: sdkPromotion.Creative,
                    position: sdkPromotion.Position
                };
                promotions.push(promotion);
            }
        }
        catch (err) {
            _iterator4.e(err);
        }
        finally {
            _iterator4.f();
        }
        return promotions;
    }
    function convertImpressions(sdkEvent) {
        if (!sdkEvent.ProductImpressions) {
            return null;
        }
        var impressions = [];
        var _iterator5 = _createForOfIteratorHelper(sdkEvent.ProductImpressions), _step5;
        try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                var sdkImpression = _step5.value;
                var impression = {
                    product_impression_list: sdkImpression.ProductImpressionList,
                    products: convertProducts(sdkImpression.ProductList)
                };
                impressions.push(impression);
            }
        }
        catch (err) {
            _iterator5.e(err);
        }
        finally {
            _iterator5.f();
        }
        return impressions;
    }
    function convertShoppingCart(sdkEvent) {
        if (!sdkEvent.ShoppingCart || !sdkEvent.ShoppingCart.ProductList || !sdkEvent.ShoppingCart.ProductList.length) {
            return null;
        }
        var shoppingCart = {
            products: convertProducts(sdkEvent.ShoppingCart.ProductList)
        };
        return shoppingCart;
    }
    function convertCommerceEvent(sdkEvent) {
        var commonEventData = convertBaseEventData(sdkEvent);
        var commerceEventData = {
            custom_flags: sdkEvent.CustomFlags,
            product_action: convertProductAction(sdkEvent),
            promotion_action: convertPromotionAction(sdkEvent),
            product_impressions: convertImpressions(sdkEvent),
            shopping_cart: convertShoppingCart(sdkEvent),
            currency_code: sdkEvent.CurrencyCode
        };
        commerceEventData = Object.assign(commerceEventData, commonEventData);
        return {
            event_type: dist_14.commerceEvent,
            data: commerceEventData
        };
    }
    function convertCrashReportEvent(sdkEvent) {
        var commonEventData = convertBaseEventData(sdkEvent);
        var crashReportEventData = {
            message: sdkEvent.EventName
        };
        crashReportEventData = Object.assign(crashReportEventData, commonEventData);
        return {
            event_type: dist_14.crashReport,
            data: crashReportEventData
        };
    }
    function convertAST(sdkEvent) {
        var commonEventData = convertBaseEventData(sdkEvent);
        var astEventData = {
            application_transition_type: dist_3.applicationInitialized,
            is_first_run: sdkEvent.IsFirstRun,
            is_upgrade: false
        };
        astEventData = Object.assign(astEventData, commonEventData);
        return {
            event_type: dist_14.applicationStateTransition,
            data: astEventData
        };
    }
    function convertSessionEndEvent(sdkEvent) {
        var commonEventData = convertBaseEventData(sdkEvent);
        var sessionEndEventData = {
            session_duration_ms: sdkEvent.SessionLength //note: External Events DTO does not support the session mpids array as of this time.
            //spanning_mpids: sdkEvent.SessionMpids
        };
        sessionEndEventData = Object.assign(sessionEndEventData, commonEventData);
        return {
            event_type: dist_14.sessionEnd,
            data: sessionEndEventData
        };
    }
    function convertSessionStartEvent(sdkEvent) {
        var commonEventData = convertBaseEventData(sdkEvent);
        var sessionStartEventData = {};
        sessionStartEventData = Object.assign(sessionStartEventData, commonEventData);
        return {
            event_type: dist_14.sessionStart,
            data: sessionStartEventData
        };
    }
    function convertPageViewEvent(sdkEvent) {
        var commonEventData = convertBaseEventData(sdkEvent);
        var screenViewEventData = {
            custom_flags: sdkEvent.CustomFlags,
            screen_name: sdkEvent.EventName
        };
        screenViewEventData = Object.assign(screenViewEventData, commonEventData);
        return {
            event_type: dist_14.screenView,
            data: screenViewEventData
        };
    }
    function convertOptOutEvent(sdkEvent) {
        var commonEventData = convertBaseEventData(sdkEvent);
        var optOutEventData = {
            is_opted_out: sdkEvent.OptOut
        };
        optOutEventData = Object.assign(optOutEventData, commonEventData);
        return {
            event_type: dist_14.optOut,
            data: optOutEventData
        };
    }
    function convertCustomEvent(sdkEvent) {
        var commonEventData = convertBaseEventData(sdkEvent);
        var customEventData = {
            custom_event_type: convertSdkEventType(sdkEvent.EventCategory),
            custom_flags: sdkEvent.CustomFlags,
            event_name: sdkEvent.EventName
        };
        customEventData = Object.assign(customEventData, commonEventData);
        return {
            event_type: dist_14.customEvent,
            data: customEventData
        };
    }
    function convertSdkEventType(sdkEventType) {
        switch (sdkEventType) {
            case Types.EventType.Other:
                return dist_10.other;
            case Types.EventType.Location:
                return dist_10.location;
            case Types.EventType.Navigation:
                return dist_10.navigation;
            case Types.EventType.Search:
                return dist_10.search;
            case Types.EventType.Social:
                return dist_10.social;
            case Types.EventType.Transaction:
                return dist_10.transaction;
            case Types.EventType.UserContent:
                return dist_10.userContent;
            case Types.EventType.UserPreference:
                return dist_10.userPreference;
            case Types.EventType.Media:
                return dist_10.media;
            case Types.CommerceEventType.ProductAddToCart:
                return dist_7.addToCart;
            case Types.CommerceEventType.ProductAddToWishlist:
                return dist_7.addToWishlist;
            case Types.CommerceEventType.ProductCheckout:
                return dist_7.checkout;
            case Types.CommerceEventType.ProductCheckoutOption:
                return dist_7.checkoutOption;
            case Types.CommerceEventType.ProductClick:
                return dist_7.click;
            case Types.CommerceEventType.ProductImpression:
                return dist_7.impression;
            case Types.CommerceEventType.ProductPurchase:
                return dist_7.purchase;
            case Types.CommerceEventType.ProductRefund:
                return dist_7.refund;
            case Types.CommerceEventType.ProductRemoveFromCart:
                return dist_7.removeFromCart;
            case Types.CommerceEventType.ProductRemoveFromWishlist:
                return dist_7.removeFromWishlist;
            case Types.CommerceEventType.ProductViewDetail:
                return dist_7.viewDetail;
            case Types.CommerceEventType.PromotionClick:
                return dist_7.promotionClick;
            case Types.CommerceEventType.PromotionView:
                return dist_7.promotionView;
            default:
                return dist_10.unknown;
        }
    }
    function convertBaseEventData(sdkEvent) {
        var commonEventData = {
            timestamp_unixtime_ms: sdkEvent.Timestamp,
            session_uuid: sdkEvent.SessionId,
            session_start_unixtime_ms: sdkEvent.SessionStartDate,
            custom_attributes: sdkEvent.EventAttributes,
            location: convertSDKLocation(sdkEvent.Location),
            source_message_id: sdkEvent.SourceMessageId
        };
        return commonEventData;
    }
    function convertSDKLocation(sdkEventLocation) {
        if (sdkEventLocation && Object.keys(sdkEventLocation).length) {
            return {
                latitude: sdkEventLocation.lat,
                longitude: sdkEventLocation.lng
            };
        }
        return null;
    }
    function convertUserAttributeChangeEvent(sdkEvent) {
        var commonEventData = convertBaseEventData(sdkEvent);
        var userAttributeChangeEvent = {
            user_attribute_name: sdkEvent.UserAttributeChanges.UserAttributeName,
            "new": sdkEvent.UserAttributeChanges.New,
            old: sdkEvent.UserAttributeChanges.Old,
            deleted: sdkEvent.UserAttributeChanges.Deleted,
            is_new_attribute: sdkEvent.UserAttributeChanges.IsNewAttribute
        };
        userAttributeChangeEvent = _objectSpread(_objectSpread({}, userAttributeChangeEvent), commonEventData);
        return {
            event_type: dist_14.userAttributeChange,
            data: userAttributeChangeEvent
        };
    }
    function convertUserIdentityChangeEvent(sdkEvent) {
        var commonEventData = convertBaseEventData(sdkEvent);
        var userIdentityChangeEvent = {
            "new": {
                identity_type: convertUserIdentityTypeToServerIdentityType(sdkEvent.UserIdentityChanges.New.IdentityType),
                identity: sdkEvent.UserIdentityChanges.New.Identity || null,
                timestamp_unixtime_ms: sdkEvent.Timestamp,
                created_this_batch: sdkEvent.UserIdentityChanges.New.CreatedThisBatch
            },
            old: {
                identity_type: convertUserIdentityTypeToServerIdentityType(sdkEvent.UserIdentityChanges.Old.IdentityType),
                identity: sdkEvent.UserIdentityChanges.Old.Identity || null,
                timestamp_unixtime_ms: sdkEvent.Timestamp,
                created_this_batch: sdkEvent.UserIdentityChanges.Old.CreatedThisBatch
            }
        };
        userIdentityChangeEvent = Object.assign(userIdentityChangeEvent, commonEventData);
        return {
            event_type: dist_14.userIdentityChange,
            data: userIdentityChangeEvent
        };
    }
    function convertUserIdentityTypeToServerIdentityType(identityType) {
        switch (identityType) {
            case SDKIdentityTypeEnum.other:
                return dist_15.other;
            case SDKIdentityTypeEnum.customerId:
                return dist_15.customerId;
            case SDKIdentityTypeEnum.facebook:
                return dist_15.facebook;
            case SDKIdentityTypeEnum.twitter:
                return dist_15.twitter;
            case SDKIdentityTypeEnum.google:
                return dist_15.google;
            case SDKIdentityTypeEnum.microsoft:
                return dist_15.microsoft;
            case SDKIdentityTypeEnum.yahoo:
                return dist_15.yahoo;
            case SDKIdentityTypeEnum.email:
                return dist_15.email;
            case SDKIdentityTypeEnum.alias:
                return dist_15.alias;
            case SDKIdentityTypeEnum.facebookCustomAudienceId:
                return dist_15.facebookCustomAudienceId;
            case SDKIdentityTypeEnum.otherId2:
                return dist_15.otherId2;
            case SDKIdentityTypeEnum.otherId3:
                return dist_15.otherId3;
            case SDKIdentityTypeEnum.otherId4:
                return dist_15.otherId4;
            case SDKIdentityTypeEnum.otherId5:
                return dist_15.otherId5;
            case SDKIdentityTypeEnum.otherId6:
                return dist_15.otherId6;
            case SDKIdentityTypeEnum.otherId7:
                return dist_15.otherId7;
            case SDKIdentityTypeEnum.otherId8:
                return dist_15.otherId8;
            case SDKIdentityTypeEnum.otherId9:
                return dist_15.otherId9;
            case SDKIdentityTypeEnum.otherId10:
                return dist_15.otherId10;
            case SDKIdentityTypeEnum.mobileNumber:
                return dist_15.mobileNumber;
            case SDKIdentityTypeEnum.phoneNumber2:
                return dist_15.phoneNumber2;
            case SDKIdentityTypeEnum.phoneNumber3:
                return dist_15.phoneNumber3;
        }
    }

    function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
    }
    else {
        result = Super.apply(this, arguments);
    } return _possibleConstructorReturn(this, result); }; }
    function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct)
        return false; if (Reflect.construct.sham)
        return false; if (typeof Proxy === "function")
        return true; try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () { }));
        return true;
    }
    catch (e) {
        return false;
    } }
    function _createForOfIteratorHelper$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") {
            if (it)
                o = it;
            var i = 0;
            var F = function F() { };
            return { s: F, n: function n() { if (i >= o.length)
                    return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try {
            if (!normalCompletion && it["return"] != null)
                it["return"]();
        }
        finally {
            if (didErr)
                throw err;
        } } }; }
    function _unsupportedIterableToArray$1(o, minLen) { if (!o)
        return; if (typeof o === "string")
        return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor)
        n = o.constructor.name; if (n === "Map" || n === "Set")
        return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray$1(o, minLen); }
    function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length)
        len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
    } return arr2; }
    var BatchUploader = /*#__PURE__*/ function () {
        //we upload JSON, but this content type is required to avoid a CORS preflight request
        function BatchUploader(mpInstance, uploadInterval) {
            var _this2 = this;
            _classCallCheck(this, BatchUploader);
            _defineProperty(this, "uploadIntervalMillis", void 0);
            _defineProperty(this, "pendingEvents", void 0);
            _defineProperty(this, "pendingUploads", void 0);
            _defineProperty(this, "mpInstance", void 0);
            _defineProperty(this, "uploadUrl", void 0);
            _defineProperty(this, "batchingEnabled", void 0);
            this.mpInstance = mpInstance;
            this.uploadIntervalMillis = uploadInterval;
            this.batchingEnabled = uploadInterval >= BatchUploader.MINIMUM_INTERVAL_MILLIS;
            if (this.uploadIntervalMillis < BatchUploader.MINIMUM_INTERVAL_MILLIS) {
                this.uploadIntervalMillis = BatchUploader.MINIMUM_INTERVAL_MILLIS;
            }
            this.pendingEvents = [];
            this.pendingUploads = [];
            var _this$mpInstance$_Sto = this.mpInstance._Store, SDKConfig = _this$mpInstance$_Sto.SDKConfig, devToken = _this$mpInstance$_Sto.devToken;
            var baseUrl = this.mpInstance._Helpers.createServiceUrl(SDKConfig.v3SecureServiceUrl, devToken);
            this.uploadUrl = "".concat(baseUrl, "/events");
            setTimeout(function () {
                _this2.prepareAndUpload(true, false);
            }, this.uploadIntervalMillis);
            this.addEventListeners();
        }
        _createClass(BatchUploader, [{
                key: "addEventListeners",
                value: function addEventListeners() {
                    var _this = this;
                    document.addEventListener('visibilitychange', function () {
                        _this.prepareAndUpload(false, _this.isBeaconAvailable());
                    });
                    window.addEventListener('beforeunload', function () {
                        _this.prepareAndUpload(false, _this.isBeaconAvailable());
                    });
                    window.addEventListener('pagehide', function () {
                        _this.prepareAndUpload(false, _this.isBeaconAvailable());
                    });
                }
            }, {
                key: "isBeaconAvailable",
                value: function isBeaconAvailable() {
                    if (navigator.sendBeacon) {
                        return true;
                    }
                    return false;
                }
            }, {
                key: "queueEvent",
                value: function queueEvent(event) {
                    if (event) {
                        this.pendingEvents.push(event);
                        this.mpInstance.Logger.verbose("Queuing event: ".concat(JSON.stringify(event)));
                        this.mpInstance.Logger.verbose("Queued event count: ".concat(this.pendingEvents.length));
                        if (!this.batchingEnabled || Types.TriggerUploadType[event.EventDataType]) {
                            this.prepareAndUpload(false, false);
                        }
                    }
                }
                /**
                 * This implements crucial logic to:
                 * - bucket pending events by MPID, and then by Session, and upload individual batches for each bucket.
                 *
                 * In the future this should enforce other requirements such as maximum batch size.
                 *
                 * @param sdkEvents current pending events
                 * @param defaultUser the user to reference for events that are missing data
                 */
            }, {
                key: "prepareAndUpload",
                value: 
                /**
                 * This is the main loop function:
                 *  - take all pending events and turn them into batches
                 *  - attempt to upload each batch
                 *
                 * @param triggerFuture whether to trigger the loop again - for manual/forced uploads this should be false
                 * @param useBeacon whether to use the beacon API - used when the page is being unloaded
                 */
                function () {
                    var _prepareAndUpload = _asyncToGenerator(/*#__PURE__*/ regenerator.mark(function _callee(triggerFuture, useBeacon) {
                        var _this3 = this;
                        var currentUser, currentEvents, newUploads, _this$pendingUploads, currentUploads, remainingUploads, _this$pendingUploads2;
                        return regenerator.wrap(function _callee$(_context) {
                            while (1) {
                                switch (_context.prev = _context.next) {
                                    case 0:
                                        currentUser = this.mpInstance.Identity.getCurrentUser();
                                        currentEvents = this.pendingEvents;
                                        this.pendingEvents = [];
                                        newUploads = BatchUploader.createNewUploads(currentEvents, currentUser, this.mpInstance);
                                        if (newUploads && newUploads.length) {
                                            (_this$pendingUploads = this.pendingUploads).push.apply(_this$pendingUploads, _toConsumableArray(newUploads));
                                        }
                                        currentUploads = this.pendingUploads;
                                        this.pendingUploads = [];
                                        _context.next = 9;
                                        return this.upload(this.mpInstance.Logger, currentUploads, useBeacon);
                                    case 9:
                                        remainingUploads = _context.sent;
                                        if (remainingUploads && remainingUploads.length) {
                                            (_this$pendingUploads2 = this.pendingUploads).unshift.apply(_this$pendingUploads2, _toConsumableArray(remainingUploads));
                                        }
                                        if (triggerFuture) {
                                            setTimeout(function () {
                                                _this3.prepareAndUpload(true, false);
                                            }, this.uploadIntervalMillis);
                                        }
                                    case 12:
                                    case "end":
                                        return _context.stop();
                                }
                            }
                        }, _callee, this);
                    }));
                    function prepareAndUpload(_x, _x2) {
                        return _prepareAndUpload.apply(this, arguments);
                    }
                    return prepareAndUpload;
                }()
            }, {
                key: "upload",
                value: function () {
                    var _upload = _asyncToGenerator(/*#__PURE__*/ regenerator.mark(function _callee2(logger, uploads, useBeacon) {
                        var uploader, i, _fetchPayload, blob, response;
                        return regenerator.wrap(function _callee2$(_context2) {
                            while (1) {
                                switch (_context2.prev = _context2.next) {
                                    case 0:
                                        if (!(!uploads || uploads.length < 1)) {
                                            _context2.next = 2;
                                            break;
                                        }
                                        return _context2.abrupt("return", null);
                                    case 2:
                                        logger.verbose("Uploading batches: ".concat(JSON.stringify(uploads)));
                                        logger.verbose("Batch count: ".concat(uploads.length));
                                        i = 0;
                                    case 5:
                                        if (!(i < uploads.length)) {
                                            _context2.next = 38;
                                            break;
                                        }
                                        _fetchPayload = {
                                            method: 'POST',
                                            headers: {
                                                Accept: BatchUploader.CONTENT_TYPE,
                                                'Content-Type': 'text/plain;charset=UTF-8'
                                            },
                                            body: JSON.stringify(uploads[i])
                                        }; // beacon is only used on onbeforeunload onpagehide events
                                        if (!(useBeacon && this.isBeaconAvailable())) {
                                            _context2.next = 12;
                                            break;
                                        }
                                        blob = new Blob([_fetchPayload.body], {
                                            type: 'text/plain;charset=UTF-8'
                                        });
                                        navigator.sendBeacon(this.uploadUrl, blob);
                                        _context2.next = 35;
                                        break;
                                    case 12:
                                        if (!uploader) {
                                            if (window.fetch) {
                                                uploader = new FetchUploader(this.uploadUrl, logger);
                                            }
                                            else {
                                                uploader = new XHRUploader(this.uploadUrl, logger);
                                            }
                                        }
                                        _context2.prev = 13;
                                        _context2.next = 16;
                                        return uploader.upload(_fetchPayload, uploads, i);
                                    case 16:
                                        response = _context2.sent;
                                        if (!(response.status >= 200 && response.status < 300)) {
                                            _context2.next = 21;
                                            break;
                                        }
                                        logger.verbose("Upload success for request ID: ".concat(uploads[i].source_request_id));
                                        _context2.next = 29;
                                        break;
                                    case 21:
                                        if (!(response.status >= 500 || response.status === 429)) {
                                            _context2.next = 26;
                                            break;
                                        }
                                        logger.error("HTTP error status ".concat(response.status, " received")); //server error, add back current events and try again later
                                        return _context2.abrupt("return", uploads.slice(i, uploads.length));
                                    case 26:
                                        if (!(response.status >= 401)) {
                                            _context2.next = 29;
                                            break;
                                        }
                                        logger.error("HTTP error status ".concat(response.status, " while uploading - please verify your API key.")); //if we're getting a 401, assume we'll keep getting a 401 and clear the uploads.
                                        return _context2.abrupt("return", null);
                                    case 29:
                                        _context2.next = 35;
                                        break;
                                    case 31:
                                        _context2.prev = 31;
                                        _context2.t0 = _context2["catch"](13);
                                        logger.error("Error sending event to mParticle servers. ".concat(_context2.t0));
                                        return _context2.abrupt("return", uploads.slice(i, uploads.length));
                                    case 35:
                                        i++;
                                        _context2.next = 5;
                                        break;
                                    case 38:
                                        return _context2.abrupt("return", null);
                                    case 39:
                                    case "end":
                                        return _context2.stop();
                                }
                            }
                        }, _callee2, this, [[13, 31]]);
                    }));
                    function upload(_x3, _x4, _x5) {
                        return _upload.apply(this, arguments);
                    }
                    return upload;
                }()
            }], [{
                key: "createNewUploads",
                value: function createNewUploads(sdkEvents, defaultUser, mpInstance) {
                    if (!defaultUser || !sdkEvents || !sdkEvents.length) {
                        return null;
                    } //bucket by MPID, and then by session, ordered by timestamp
                    var newUploads = [];
                    var eventsByUser = new Map();
                    var _iterator = _createForOfIteratorHelper$1(sdkEvents), _step;
                    try {
                        for (_iterator.s(); !(_step = _iterator.n()).done;) {
                            var _sdkEvent = _step.value;
                            //on initial startup, there may be events logged without an mpid.
                            if (!_sdkEvent.MPID) {
                                var _mpid = defaultUser.getMPID();
                                _sdkEvent.MPID = _mpid;
                            }
                            var _events = eventsByUser.get(_sdkEvent.MPID);
                            if (!_events) {
                                _events = [];
                            }
                            _events.push(_sdkEvent);
                            eventsByUser.set(_sdkEvent.MPID, _events);
                        }
                    }
                    catch (err) {
                        _iterator.e(err);
                    }
                    finally {
                        _iterator.f();
                    }
                    for (var _i = 0, _Array$from = Array.from(eventsByUser.entries()); _i < _Array$from.length; _i++) {
                        var entry = _Array$from[_i];
                        var mpid = entry[0];
                        var userEvents = entry[1];
                        var eventsBySession = new Map();
                        var _iterator2 = _createForOfIteratorHelper$1(userEvents), _step2;
                        try {
                            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                                var sdkEvent = _step2.value;
                                var events = eventsBySession.get(sdkEvent.SessionId);
                                if (!events) {
                                    events = [];
                                }
                                events.push(sdkEvent);
                                eventsBySession.set(sdkEvent.SessionId, events);
                            }
                        }
                        catch (err) {
                            _iterator2.e(err);
                        }
                        finally {
                            _iterator2.f();
                        }
                        for (var _i2 = 0, _Array$from2 = Array.from(eventsBySession.entries()); _i2 < _Array$from2.length; _i2++) {
                            var _entry = _Array$from2[_i2];
                            var upload = convertEvents(mpid, _entry[1], mpInstance);
                            if (upload) {
                                newUploads.push(upload);
                            }
                        }
                    }
                    return newUploads;
                }
            }]);
        return BatchUploader;
    }();
    _defineProperty(BatchUploader, "CONTENT_TYPE", 'text/plain;charset=UTF-8');
    _defineProperty(BatchUploader, "MINIMUM_INTERVAL_MILLIS", 500);
    var AsyncUploader = function AsyncUploader(url, logger) {
        _classCallCheck(this, AsyncUploader);
        _defineProperty(this, "url", void 0);
        _defineProperty(this, "logger", void 0);
        this.url = url;
        this.logger = logger;
    };
    var FetchUploader = /*#__PURE__*/ function (_AsyncUploader) {
        _inherits(FetchUploader, _AsyncUploader);
        var _super = _createSuper(FetchUploader);
        function FetchUploader() {
            _classCallCheck(this, FetchUploader);
            return _super.apply(this, arguments);
        }
        _createClass(FetchUploader, [{
                key: "upload",
                value: function () {
                    var _upload2 = _asyncToGenerator(/*#__PURE__*/ regenerator.mark(function _callee3(fetchPayload, uploads, i) {
                        var response;
                        return regenerator.wrap(function _callee3$(_context3) {
                            while (1) {
                                switch (_context3.prev = _context3.next) {
                                    case 0:
                                        _context3.next = 2;
                                        return fetch(this.url, fetchPayload);
                                    case 2:
                                        response = _context3.sent;
                                        return _context3.abrupt("return", response);
                                    case 4:
                                    case "end":
                                        return _context3.stop();
                                }
                            }
                        }, _callee3, this);
                    }));
                    function upload(_x6, _x7, _x8) {
                        return _upload2.apply(this, arguments);
                    }
                    return upload;
                }()
            }]);
        return FetchUploader;
    }(AsyncUploader);
    var XHRUploader = /*#__PURE__*/ function (_AsyncUploader2) {
        _inherits(XHRUploader, _AsyncUploader2);
        var _super2 = _createSuper(XHRUploader);
        function XHRUploader() {
            _classCallCheck(this, XHRUploader);
            return _super2.apply(this, arguments);
        }
        _createClass(XHRUploader, [{
                key: "upload",
                value: function () {
                    var _upload3 = _asyncToGenerator(/*#__PURE__*/ regenerator.mark(function _callee4(fetchPayload, uploads, i) {
                        var response;
                        return regenerator.wrap(function _callee4$(_context4) {
                            while (1) {
                                switch (_context4.prev = _context4.next) {
                                    case 0:
                                        _context4.next = 2;
                                        return this.makeRequest(this.url, this.logger, fetchPayload.body);
                                    case 2:
                                        response = _context4.sent;
                                        return _context4.abrupt("return", response);
                                    case 4:
                                    case "end":
                                        return _context4.stop();
                                }
                            }
                        }, _callee4, this);
                    }));
                    function upload(_x9, _x10, _x11) {
                        return _upload3.apply(this, arguments);
                    }
                    return upload;
                }()
            }, {
                key: "makeRequest",
                value: function () {
                    var _makeRequest = _asyncToGenerator(/*#__PURE__*/ regenerator.mark(function _callee5(url, logger, data) {
                        var xhr;
                        return regenerator.wrap(function _callee5$(_context5) {
                            while (1) {
                                switch (_context5.prev = _context5.next) {
                                    case 0:
                                        xhr = new XMLHttpRequest();
                                        return _context5.abrupt("return", new Promise(function (resolve, reject) {
                                            xhr.onreadystatechange = function () {
                                                if (xhr.readyState !== 4)
                                                    return; // Process the response
                                                // Process the response
                                                if (xhr.status >= 200 && xhr.status < 300) {
                                                    resolve(xhr);
                                                }
                                                else {
                                                    reject(xhr);
                                                }
                                            };
                                            xhr.open('post', url);
                                            xhr.send(data);
                                        }));
                                    case 2:
                                    case "end":
                                        return _context5.stop();
                                }
                            }
                        }, _callee5);
                    }));
                    function makeRequest(_x12, _x13, _x14) {
                        return _makeRequest.apply(this, arguments);
                    }
                    return makeRequest;
                }()
            }]);
        return XHRUploader;
    }(AsyncUploader);

    var Messages = Constants.Messages;
    function APIClient(mpInstance, kitBlocker) {
      this.uploader = null;
      var self = this;

      this.queueEventForBatchUpload = function (event) {
        if (!this.uploader) {
          var millis = mpInstance._Helpers.getFeatureFlag(Constants.FeatureFlags.EventBatchingIntervalMillis);

          this.uploader = new BatchUploader(mpInstance, millis);
        }

        this.uploader.queueEvent(event);
      };

      this.shouldEnableBatching = function () {
        // Returns a string of a number that must be parsed
        // Invalid strings will be parsed to NaN which is falsey
        var eventsV3Percentage = parseInt(mpInstance._Helpers.getFeatureFlag(Constants.FeatureFlags.EventsV3), 10);

        if (!eventsV3Percentage) {
          return false;
        }

        var rampNumber = mpInstance._Helpers.getRampNumber(mpInstance._Store.deviceId);

        return eventsV3Percentage >= rampNumber;
      };

      this.processQueuedEvents = function () {
        var mpid,
            currentUser = mpInstance.Identity.getCurrentUser();

        if (currentUser) {
          mpid = currentUser.getMPID();
        }

        if (mpInstance._Store.eventQueue.length && mpid) {
          var localQueueCopy = mpInstance._Store.eventQueue;
          mpInstance._Store.eventQueue = [];
          this.appendUserInfoToEvents(currentUser, localQueueCopy);
          localQueueCopy.forEach(function (event) {
            self.sendEventToServer(event);
          });
        }
      };

      this.appendUserInfoToEvents = function (user, events) {
        events.forEach(function (event) {
          if (!event.MPID) {
            mpInstance._ServerModel.appendUserInfo(user, event);
          }
        });
      };

      this.sendEventToServer = function (event) {
        if (mpInstance._Store.webviewBridgeEnabled) {
          mpInstance._NativeSdkHelpers.sendToNative(Constants.NativeSdkPaths.LogEvent, JSON.stringify(event));

          return;
        }

        var mpid,
            currentUser = mpInstance.Identity.getCurrentUser();

        if (currentUser) {
          mpid = currentUser.getMPID();
        }

        mpInstance._Store.requireDelay = mpInstance._Helpers.isDelayedByIntegration(mpInstance._preInit.integrationDelays, mpInstance._Store.integrationDelayTimeoutStart, Date.now()); // We queue events if there is no MPID (MPID is null, or === 0), or there are integrations that that require this to stall because integration attributes
        // need to be set, or if we are still fetching the config (self hosted only), and so require delaying events

        if (!mpid || mpInstance._Store.requireDelay || !mpInstance._Store.configurationLoaded) {
          mpInstance.Logger.verbose('Event was added to eventQueue. eventQueue will be processed once a valid MPID is returned or there is no more integration imposed delay.');

          mpInstance._Store.eventQueue.push(event);

          return;
        }

        this.processQueuedEvents();

        if (this.shouldEnableBatching()) {
          this.queueEventForBatchUpload(event);
        } else {
          this.sendSingleEventToServer(event);
        }

        if (event && event.EventName !== Types.MessageType.AppStateTransition) {
          if (kitBlocker && kitBlocker.kitBlockingEnabled) {
            event = kitBlocker.createBlockedEvent(event);
          }

          if (event) {
            mpInstance._Forwarders.sendEventToForwarders(event);
          }
        }
      };

      this.sendSingleEventToServer = function (event) {
        if (event.EventDataType === Types.MessageType.Media) {
          return;
        }

        var xhr,
            xhrCallback = function xhrCallback() {
          if (xhr.readyState === 4) {
            mpInstance.Logger.verbose('Received ' + xhr.statusText + ' from server');

            mpInstance._Persistence.update();
          }
        };

        if (!event) {
          mpInstance.Logger.error(Messages.ErrorMessages.EventEmpty);
          return;
        }

        mpInstance.Logger.verbose(Messages.InformationMessages.SendHttp);
        xhr = mpInstance._Helpers.createXHR(xhrCallback);

        if (xhr) {
          try {
            xhr.open('post', mpInstance._Helpers.createServiceUrl(mpInstance._Store.SDKConfig.v2SecureServiceUrl, mpInstance._Store.devToken) + '/Events');
            xhr.send(JSON.stringify(mpInstance._ServerModel.convertEventToDTO(event)));
          } catch (e) {
            mpInstance.Logger.error('Error sending event to mParticle servers. ' + e);
          }
        }
      };

      this.sendBatchForwardingStatsToServer = function (forwardingStatsData, xhr) {
        var url, data;

        try {
          url = mpInstance._Helpers.createServiceUrl(mpInstance._Store.SDKConfig.v2SecureServiceUrl, mpInstance._Store.devToken);
          data = {
            uuid: mpInstance._Helpers.generateUniqueId(),
            data: forwardingStatsData
          };

          if (xhr) {
            xhr.open('post', url + '/Forwarding');
            xhr.send(JSON.stringify(data));
          }
        } catch (e) {
          mpInstance.Logger.error('Error sending forwarding stats to mParticle servers.');
        }
      };

      this.sendSingleForwardingStatsToServer = function (forwardingStatsData) {
        var url, data;

        try {
          var xhrCallback = function xhrCallback() {
            if (xhr.readyState === 4) {
              if (xhr.status === 202) {
                mpInstance.Logger.verbose('Successfully sent  ' + xhr.statusText + ' from server');
              }
            }
          };

          var xhr = mpInstance._Helpers.createXHR(xhrCallback);

          url = mpInstance._Helpers.createServiceUrl(mpInstance._Store.SDKConfig.v1SecureServiceUrl, mpInstance._Store.devToken);
          data = forwardingStatsData;

          if (xhr) {
            xhr.open('post', url + '/Forwarding');
            xhr.send(JSON.stringify(data));
          }
        } catch (e) {
          mpInstance.Logger.error('Error sending forwarding stats to mParticle servers.');
        }
      };

      this.prepareForwardingStats = function (forwarder, event) {
        var forwardingStatsData,
            queue = mpInstance._Forwarders.getForwarderStatsQueue();

        if (forwarder && forwarder.isVisible) {
          forwardingStatsData = {
            mid: forwarder.id,
            esid: forwarder.eventSubscriptionId,
            n: event.EventName,
            attrs: event.EventAttributes,
            sdk: event.SDKVersion,
            dt: event.EventDataType,
            et: event.EventCategory,
            dbg: event.Debug,
            ct: event.Timestamp,
            eec: event.ExpandedEventCount,
            dp: event.DataPlan
          };

          if (mpInstance._Helpers.getFeatureFlag(Constants.FeatureFlags.ReportBatching)) {
            queue.push(forwardingStatsData);

            mpInstance._Forwarders.setForwarderStatsQueue(queue);
          } else {
            self.sendSingleForwardingStatsToServer(forwardingStatsData);
          }
        }
      };
    }

    var slugify = createCommonjsModule(function (module, exports) {
    (function (name, root, factory) {
      {
        module.exports = factory();
        module.exports['default'] = factory();
      }
    }('slugify', commonjsGlobal, function () {
      var charMap = JSON.parse('{"$":"dollar","%":"percent","&":"and","<":"less",">":"greater","|":"or","¢":"cent","£":"pound","¤":"currency","¥":"yen","©":"(c)","ª":"a","®":"(r)","º":"o","À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","Æ":"AE","Ç":"C","È":"E","É":"E","Ê":"E","Ë":"E","Ì":"I","Í":"I","Î":"I","Ï":"I","Ð":"D","Ñ":"N","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","Ù":"U","Ú":"U","Û":"U","Ü":"U","Ý":"Y","Þ":"TH","ß":"ss","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","æ":"ae","ç":"c","è":"e","é":"e","ê":"e","ë":"e","ì":"i","í":"i","î":"i","ï":"i","ð":"d","ñ":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","ù":"u","ú":"u","û":"u","ü":"u","ý":"y","þ":"th","ÿ":"y","Ā":"A","ā":"a","Ă":"A","ă":"a","Ą":"A","ą":"a","Ć":"C","ć":"c","Č":"C","č":"c","Ď":"D","ď":"d","Đ":"DJ","đ":"dj","Ē":"E","ē":"e","Ė":"E","ė":"e","Ę":"e","ę":"e","Ě":"E","ě":"e","Ğ":"G","ğ":"g","Ģ":"G","ģ":"g","Ĩ":"I","ĩ":"i","Ī":"i","ī":"i","Į":"I","į":"i","İ":"I","ı":"i","Ķ":"k","ķ":"k","Ļ":"L","ļ":"l","Ľ":"L","ľ":"l","Ł":"L","ł":"l","Ń":"N","ń":"n","Ņ":"N","ņ":"n","Ň":"N","ň":"n","Ō":"O","ō":"o","Ő":"O","ő":"o","Œ":"OE","œ":"oe","Ŕ":"R","ŕ":"r","Ř":"R","ř":"r","Ś":"S","ś":"s","Ş":"S","ş":"s","Š":"S","š":"s","Ţ":"T","ţ":"t","Ť":"T","ť":"t","Ũ":"U","ũ":"u","Ū":"u","ū":"u","Ů":"U","ů":"u","Ű":"U","ű":"u","Ų":"U","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","ź":"z","Ż":"Z","ż":"z","Ž":"Z","ž":"z","Ə":"E","ƒ":"f","Ơ":"O","ơ":"o","Ư":"U","ư":"u","ǈ":"LJ","ǉ":"lj","ǋ":"NJ","ǌ":"nj","Ș":"S","ș":"s","Ț":"T","ț":"t","ə":"e","˚":"o","Ά":"A","Έ":"E","Ή":"H","Ί":"I","Ό":"O","Ύ":"Y","Ώ":"W","ΐ":"i","Α":"A","Β":"B","Γ":"G","Δ":"D","Ε":"E","Ζ":"Z","Η":"H","Θ":"8","Ι":"I","Κ":"K","Λ":"L","Μ":"M","Ν":"N","Ξ":"3","Ο":"O","Π":"P","Ρ":"R","Σ":"S","Τ":"T","Υ":"Y","Φ":"F","Χ":"X","Ψ":"PS","Ω":"W","Ϊ":"I","Ϋ":"Y","ά":"a","έ":"e","ή":"h","ί":"i","ΰ":"y","α":"a","β":"b","γ":"g","δ":"d","ε":"e","ζ":"z","η":"h","θ":"8","ι":"i","κ":"k","λ":"l","μ":"m","ν":"n","ξ":"3","ο":"o","π":"p","ρ":"r","ς":"s","σ":"s","τ":"t","υ":"y","φ":"f","χ":"x","ψ":"ps","ω":"w","ϊ":"i","ϋ":"y","ό":"o","ύ":"y","ώ":"w","Ё":"Yo","Ђ":"DJ","Є":"Ye","І":"I","Ї":"Yi","Ј":"J","Љ":"LJ","Њ":"NJ","Ћ":"C","Џ":"DZ","А":"A","Б":"B","В":"V","Г":"G","Д":"D","Е":"E","Ж":"Zh","З":"Z","И":"I","Й":"J","К":"K","Л":"L","М":"M","Н":"N","О":"O","П":"P","Р":"R","С":"S","Т":"T","У":"U","Ф":"F","Х":"H","Ц":"C","Ч":"Ch","Ш":"Sh","Щ":"Sh","Ъ":"U","Ы":"Y","Ь":"","Э":"E","Ю":"Yu","Я":"Ya","а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ж":"zh","з":"z","и":"i","й":"j","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"h","ц":"c","ч":"ch","ш":"sh","щ":"sh","ъ":"u","ы":"y","ь":"","э":"e","ю":"yu","я":"ya","ё":"yo","ђ":"dj","є":"ye","і":"i","ї":"yi","ј":"j","љ":"lj","њ":"nj","ћ":"c","ѝ":"u","џ":"dz","Ґ":"G","ґ":"g","Ғ":"GH","ғ":"gh","Қ":"KH","қ":"kh","Ң":"NG","ң":"ng","Ү":"UE","ү":"ue","Ұ":"U","ұ":"u","Һ":"H","һ":"h","Ә":"AE","ә":"ae","Ө":"OE","ө":"oe","฿":"baht","ა":"a","ბ":"b","გ":"g","დ":"d","ე":"e","ვ":"v","ზ":"z","თ":"t","ი":"i","კ":"k","ლ":"l","მ":"m","ნ":"n","ო":"o","პ":"p","ჟ":"zh","რ":"r","ს":"s","ტ":"t","უ":"u","ფ":"f","ქ":"k","ღ":"gh","ყ":"q","შ":"sh","ჩ":"ch","ც":"ts","ძ":"dz","წ":"ts","ჭ":"ch","ხ":"kh","ჯ":"j","ჰ":"h","Ẁ":"W","ẁ":"w","Ẃ":"W","ẃ":"w","Ẅ":"W","ẅ":"w","ẞ":"SS","Ạ":"A","ạ":"a","Ả":"A","ả":"a","Ấ":"A","ấ":"a","Ầ":"A","ầ":"a","Ẩ":"A","ẩ":"a","Ẫ":"A","ẫ":"a","Ậ":"A","ậ":"a","Ắ":"A","ắ":"a","Ằ":"A","ằ":"a","Ẳ":"A","ẳ":"a","Ẵ":"A","ẵ":"a","Ặ":"A","ặ":"a","Ẹ":"E","ẹ":"e","Ẻ":"E","ẻ":"e","Ẽ":"E","ẽ":"e","Ế":"E","ế":"e","Ề":"E","ề":"e","Ể":"E","ể":"e","Ễ":"E","ễ":"e","Ệ":"E","ệ":"e","Ỉ":"I","ỉ":"i","Ị":"I","ị":"i","Ọ":"O","ọ":"o","Ỏ":"O","ỏ":"o","Ố":"O","ố":"o","Ồ":"O","ồ":"o","Ổ":"O","ổ":"o","Ỗ":"O","ỗ":"o","Ộ":"O","ộ":"o","Ớ":"O","ớ":"o","Ờ":"O","ờ":"o","Ở":"O","ở":"o","Ỡ":"O","ỡ":"o","Ợ":"O","ợ":"o","Ụ":"U","ụ":"u","Ủ":"U","ủ":"u","Ứ":"U","ứ":"u","Ừ":"U","ừ":"u","Ử":"U","ử":"u","Ữ":"U","ữ":"u","Ự":"U","ự":"u","Ỳ":"Y","ỳ":"y","Ỵ":"Y","ỵ":"y","Ỷ":"Y","ỷ":"y","Ỹ":"Y","ỹ":"y","‘":"\'","’":"\'","“":"\\\"","”":"\\\"","†":"+","•":"*","…":"...","₠":"ecu","₢":"cruzeiro","₣":"french franc","₤":"lira","₥":"mill","₦":"naira","₧":"peseta","₨":"rupee","₩":"won","₪":"new shequel","₫":"dong","€":"euro","₭":"kip","₮":"tugrik","₯":"drachma","₰":"penny","₱":"peso","₲":"guarani","₳":"austral","₴":"hryvnia","₵":"cedi","₸":"kazakhstani tenge","₹":"indian rupee","₺":"turkish lira","₽":"russian ruble","₿":"bitcoin","℠":"sm","™":"tm","∂":"d","∆":"delta","∑":"sum","∞":"infinity","♥":"love","元":"yuan","円":"yen","﷼":"rial"}');
      var locales = JSON.parse('{"de":{"Ä":"AE","ä":"ae","Ö":"OE","ö":"oe","Ü":"UE","ü":"ue","%":"prozent","&":"und","|":"oder","∑":"summe","∞":"unendlich","♥":"liebe"},"vi":{"Đ":"D","đ":"d"},"fr":{"%":"pourcent","&":"et","<":"plus petit",">":"plus grand","|":"ou","¢":"centime","£":"livre","¤":"devise","₣":"franc","∑":"somme","∞":"infini","♥":"amour"}}');

      function replace (string, options) {
        if (typeof string !== 'string') {
          throw new Error('slugify: string argument expected')
        }

        options = (typeof options === 'string')
          ? {replacement: options}
          : options || {};

        var locale = locales[options.locale] || {};

        var replacement = options.replacement === undefined ? '-' : options.replacement;

        var slug = string.normalize().split('')
          // replace characters based on charMap
          .reduce(function (result, ch) {
            return result + (locale[ch] || charMap[ch] || ch)
              // remove not allowed characters
              .replace(options.remove || /[^\w\s$*_+~.()'"!\-:@]+/g, '')
          }, '')
          // trim leading/trailing spaces
          .trim()
          // convert spaces to replacement character
          // also remove duplicates of the replacement character
          .replace(new RegExp('[\\s' + replacement + ']+', 'g'), replacement);

        if (options.lower) {
          slug = slug.toLowerCase();
        }

        if (options.strict) {
          // remove anything besides letters, numbers, and the replacement char
          slug = slug
            .replace(new RegExp('[^a-zA-Z0-9' + replacement + ']', 'g'), '')
            // remove duplicates of the replacement character
            .replace(new RegExp('[\\s' + replacement + ']+', 'g'), replacement);
        }

        return slug
      }

      replace.extend = function (customMap) {
        for (var key in customMap) {
          charMap[key] = customMap[key];
        }
      };

      return replace
    }));
    });

    var StorageNames = Constants.StorageNames,
        pluses = /\+/g;
    function Helpers(mpInstance) {
      var self = this;

      this.canLog = function () {
        if (mpInstance._Store.isEnabled && (mpInstance._Store.devToken || mpInstance._Store.webviewBridgeEnabled)) {
          return true;
        }

        return false;
      };

      this.returnConvertedBoolean = function (data) {
        if (data === 'false' || data === '0') {
          return false;
        } else {
          return Boolean(data);
        }
      };

      this.getFeatureFlag = function (feature) {
        if (mpInstance._Store.SDKConfig.flags.hasOwnProperty(feature)) {
          return mpInstance._Store.SDKConfig.flags[feature];
        }

        return null;
      };
      /**
       * Returns a value between 1-100 inclusive.
       */


      this.getRampNumber = function (deviceId) {
        if (!deviceId) {
          return 100;
        }

        var hash = self.generateHash(deviceId);
        return Math.abs(hash % 100) + 1;
      };

      this.invokeCallback = function (callback, code, body, mParticleUser, previousMpid) {
        if (!callback) {
          mpInstance.Logger.warning('There is no callback provided');
        }

        try {
          if (self.Validators.isFunction(callback)) {
            callback({
              httpCode: code,
              body: body,
              getUser: function getUser() {
                if (mParticleUser) {
                  return mParticleUser;
                } else {
                  return mpInstance.Identity.getCurrentUser();
                }
              },
              getPreviousUser: function getPreviousUser() {
                if (!previousMpid) {
                  var users = mpInstance.Identity.getUsers();
                  var mostRecentUser = users.shift();
                  var currentUser = mParticleUser || mpInstance.Identity.getCurrentUser();

                  if (mostRecentUser && currentUser && mostRecentUser.getMPID() === currentUser.getMPID()) {
                    mostRecentUser = users.shift();
                  }

                  return mostRecentUser || null;
                } else {
                  return mpInstance.Identity.getUser(previousMpid);
                }
              }
            });
          }
        } catch (e) {
          mpInstance.Logger.error('There was an error with your callback: ' + e);
        }
      };

      this.invokeAliasCallback = function (callback, code, message) {
        if (!callback) {
          mpInstance.Logger.warning('There is no callback provided');
        }

        try {
          if (self.Validators.isFunction(callback)) {
            var callbackMessage = {
              httpCode: code
            };

            if (message) {
              callbackMessage.message = message;
            }

            callback(callbackMessage);
          }
        } catch (e) {
          mpInstance.Logger.error('There was an error with your callback: ' + e);
        }
      }; // Standalone version of jQuery.extend, from https://github.com/dansdom/extend


      this.extend = function () {
        var options,
            name,
            src,
            copy,
            copyIsArray,
            clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false,
            // helper which replicates the jquery internal functions
        objectHelper = {
          hasOwn: Object.prototype.hasOwnProperty,
          class2type: {},
          type: function type(obj) {
            return obj == null ? String(obj) : objectHelper.class2type[Object.prototype.toString.call(obj)] || 'object';
          },
          isPlainObject: function isPlainObject(obj) {
            if (!obj || objectHelper.type(obj) !== 'object' || obj.nodeType || objectHelper.isWindow(obj)) {
              return false;
            }

            try {
              if (obj.constructor && !objectHelper.hasOwn.call(obj, 'constructor') && !objectHelper.hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
                return false;
              }
            } catch (e) {
              return false;
            }

            var key;

            for (key in obj) {} // eslint-disable-line no-empty


            return key === undefined || objectHelper.hasOwn.call(obj, key);
          },
          isArray: Array.isArray || function (obj) {
            return objectHelper.type(obj) === 'array';
          },
          isFunction: function isFunction(obj) {
            return objectHelper.type(obj) === 'function';
          },
          isWindow: function isWindow(obj) {
            return obj != null && obj == obj.window;
          }
        }; // end of objectHelper
        // Handle a deep copy situation

        if (typeof target === 'boolean') {
          deep = target;
          target = arguments[1] || {}; // skip the boolean and the target

          i = 2;
        } // Handle case when target is a string or something (possible in deep copy)


        if (_typeof(target) !== 'object' && !objectHelper.isFunction(target)) {
          target = {};
        } // If no second argument is used then this can extend an object that is using this method


        if (length === i) {
          target = this;
          --i;
        }

        for (; i < length; i++) {
          // Only deal with non-null/undefined values
          if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
              src = target[name];
              copy = options[name]; // Prevent never-ending loop

              if (target === copy) {
                continue;
              } // Recurse if we're merging plain objects or arrays


              if (deep && copy && (objectHelper.isPlainObject(copy) || (copyIsArray = objectHelper.isArray(copy)))) {
                if (copyIsArray) {
                  copyIsArray = false;
                  clone = src && objectHelper.isArray(src) ? src : [];
                } else {
                  clone = src && objectHelper.isPlainObject(src) ? src : {};
                } // Never move original objects, clone them


                target[name] = self.extend(deep, clone, copy); // Don't bring in undefined values
              } else if (copy !== undefined) {
                target[name] = copy;
              }
            }
          }
        } // Return the modified object


        return target;
      };

      this.isObject = function (value) {
        var objType = Object.prototype.toString.call(value);
        return objType === '[object Object]' || objType === '[object Error]';
      };

      this.inArray = function (items, name) {
        var i = 0;

        if (Array.prototype.indexOf) {
          return items.indexOf(name, 0) >= 0;
        } else {
          for (var n = items.length; i < n; i++) {
            if (i in items && items[i] === name) {
              return true;
            }
          }
        }
      };

      this.createServiceUrl = function (secureServiceUrl, devToken) {
        var serviceScheme = window.mParticle && mpInstance._Store.SDKConfig.forceHttps ? 'https://' : window.location.protocol + '//';
        var baseUrl;

        if (mpInstance._Store.SDKConfig.forceHttps) {
          baseUrl = 'https://' + secureServiceUrl;
        } else {
          baseUrl = serviceScheme + secureServiceUrl;
        }

        if (devToken) {
          baseUrl = baseUrl + devToken;
        }

        return baseUrl;
      };

      this.createXHR = function (cb) {
        var xhr;

        try {
          xhr = new window.XMLHttpRequest();
        } catch (e) {
          mpInstance.Logger.error('Error creating XMLHttpRequest object.');
        }

        if (xhr && cb && 'withCredentials' in xhr) {
          xhr.onreadystatechange = cb;
        } else if (typeof window.XDomainRequest !== 'undefined') {
          mpInstance.Logger.verbose('Creating XDomainRequest object');

          try {
            xhr = new window.XDomainRequest();
            xhr.onload = cb;
          } catch (e) {
            mpInstance.Logger.error('Error creating XDomainRequest object');
          }
        }

        return xhr;
      };

      function generateRandomValue(a) {
        var randomValue;

        if (window.crypto && window.crypto.getRandomValues) {
          randomValue = window.crypto.getRandomValues(new Uint8Array(1)); // eslint-disable-line no-undef
        }

        if (randomValue) {
          return (a ^ randomValue[0] % 16 >> a / 4).toString(16);
        }

        return (a ^ Math.random() * 16 >> a / 4).toString(16);
      }

      this.generateUniqueId = function (a) {
        // https://gist.github.com/jed/982883
        // Added support for crypto for better random
        return a // if the placeholder was passed, return
        ? generateRandomValue(a) // a random number
        : // or otherwise a concatenated string:
        ([1e7] + // 10000000 +
        -1e3 + // -1000 +
        -4e3 + // -4000 +
        -8e3 + // -80000000 +
        -1e11). // -100000000000,
        replace( // replacing
        /[018]/g, // zeroes, ones, and eights with
        self.generateUniqueId // random hex digits
        );
      };

      this.filterUserIdentities = function (userIdentitiesObject, filterList) {
        var filteredUserIdentities = [];

        if (userIdentitiesObject && Object.keys(userIdentitiesObject).length) {
          for (var userIdentityName in userIdentitiesObject) {
            if (userIdentitiesObject.hasOwnProperty(userIdentityName)) {
              var userIdentityType = Types.IdentityType.getIdentityType(userIdentityName);

              if (!self.inArray(filterList, userIdentityType)) {
                var identity = {
                  Type: userIdentityType,
                  Identity: userIdentitiesObject[userIdentityName]
                };

                if (userIdentityType === Types.IdentityType.CustomerId) {
                  filteredUserIdentities.unshift(identity);
                } else {
                  filteredUserIdentities.push(identity);
                }
              }
            }
          }
        }

        return filteredUserIdentities;
      };

      this.filterUserIdentitiesForForwarders = function (userIdentitiesObject, filterList) {
        var filteredUserIdentities = {};

        if (userIdentitiesObject && Object.keys(userIdentitiesObject).length) {
          for (var userIdentityName in userIdentitiesObject) {
            if (userIdentitiesObject.hasOwnProperty(userIdentityName)) {
              var userIdentityType = Types.IdentityType.getIdentityType(userIdentityName);

              if (!self.inArray(filterList, userIdentityType)) {
                filteredUserIdentities[userIdentityName] = userIdentitiesObject[userIdentityName];
              }
            }
          }
        }

        return filteredUserIdentities;
      };

      this.filterUserAttributes = function (userAttributes, filterList) {
        var filteredUserAttributes = {};

        if (userAttributes && Object.keys(userAttributes).length) {
          for (var userAttribute in userAttributes) {
            if (userAttributes.hasOwnProperty(userAttribute)) {
              var hashedUserAttribute = self.generateHash(userAttribute);

              if (!self.inArray(filterList, hashedUserAttribute)) {
                filteredUserAttributes[userAttribute] = userAttributes[userAttribute];
              }
            }
          }
        }

        return filteredUserAttributes;
      };

      this.findKeyInObject = function (obj, key) {
        if (key && obj) {
          for (var prop in obj) {
            if (obj.hasOwnProperty(prop) && prop.toLowerCase() === key.toLowerCase()) {
              return prop;
            }
          }
        }

        return null;
      };

      this.decoded = function (s) {
        return decodeURIComponent(s.replace(pluses, ' '));
      };

      this.converted = function (s) {
        if (s.indexOf('"') === 0) {
          s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        return s;
      };

      this.isEventType = function (type) {
        for (var prop in Types.EventType) {
          if (Types.EventType.hasOwnProperty(prop)) {
            if (Types.EventType[prop] === type) {
              return true;
            }
          }
        }

        return false;
      };

      this.parseNumber = function (value) {
        if (isNaN(value) || !isFinite(value)) {
          return 0;
        }

        var floatValue = parseFloat(value);
        return isNaN(floatValue) ? 0 : floatValue;
      };

      this.parseStringOrNumber = function (value) {
        if (self.Validators.isStringOrNumber(value)) {
          return value;
        } else {
          return null;
        }
      };

      this.generateHash = function (name) {
        var hash = 0,
            i = 0,
            character;

        if (name === undefined || name === null) {
          return 0;
        }

        name = name.toString().toLowerCase();

        if (Array.prototype.reduce) {
          return name.split('').reduce(function (a, b) {
            a = (a << 5) - a + b.charCodeAt(0);
            return a & a;
          }, 0);
        }

        if (name.length === 0) {
          return hash;
        }

        for (i = 0; i < name.length; i++) {
          character = name.charCodeAt(i);
          hash = (hash << 5) - hash + character;
          hash = hash & hash;
        }

        return hash;
      };

      this.sanitizeAttributes = function (attrs, name) {
        if (!attrs || !self.isObject(attrs)) {
          return null;
        }

        var sanitizedAttrs = {};

        for (var prop in attrs) {
          // Make sure that attribute values are not objects or arrays, which are not valid
          if (attrs.hasOwnProperty(prop) && self.Validators.isValidAttributeValue(attrs[prop])) {
            sanitizedAttrs[prop] = attrs[prop];
          } else {
            mpInstance.Logger.warning("For '" + name + "', the corresponding attribute value of '" + prop + "' must be a string, number, boolean, or null.");
          }
        }

        return sanitizedAttrs;
      };

      this.Validators = {
        isValidAttributeValue: function isValidAttributeValue(value) {
          return value !== undefined && !self.isObject(value) && !Array.isArray(value);
        },
        // Neither null nor undefined can be a valid Key
        isValidKeyValue: function isValidKeyValue(key) {
          return Boolean(key && !self.isObject(key) && !Array.isArray(key));
        },
        isStringOrNumber: function isStringOrNumber(value) {
          return typeof value === 'string' || typeof value === 'number';
        },
        isNumber: function isNumber(value) {
          return typeof value === 'number';
        },
        isFunction: function isFunction(fn) {
          return typeof fn === 'function';
        },
        validateIdentities: function validateIdentities(identityApiData, method) {
          var validIdentityRequestKeys = {
            userIdentities: 1,
            onUserAlias: 1,
            copyUserAttributes: 1
          };

          if (identityApiData) {
            if (method === 'modify') {
              if (self.isObject(identityApiData.userIdentities) && !Object.keys(identityApiData.userIdentities).length || !self.isObject(identityApiData.userIdentities)) {
                return {
                  valid: false,
                  error: Constants.Messages.ValidationMessages.ModifyIdentityRequestUserIdentitiesPresent
                };
              }
            }

            for (var key in identityApiData) {
              if (identityApiData.hasOwnProperty(key)) {
                if (!validIdentityRequestKeys[key]) {
                  return {
                    valid: false,
                    error: Constants.Messages.ValidationMessages.IdentityRequesetInvalidKey
                  };
                }

                if (key === 'onUserAlias' && !mpInstance._Helpers.Validators.isFunction(identityApiData[key])) {
                  return {
                    valid: false,
                    error: Constants.Messages.ValidationMessages.OnUserAliasType + _typeof(identityApiData[key])
                  };
                }
              }
            }

            if (Object.keys(identityApiData).length === 0) {
              return {
                valid: true
              };
            } else {
              // identityApiData.userIdentities can't be undefined
              if (identityApiData.userIdentities === undefined) {
                return {
                  valid: false,
                  error: Constants.Messages.ValidationMessages.UserIdentities
                }; // identityApiData.userIdentities can be null, but if it isn't null or undefined (above conditional), it must be an object
              } else if (identityApiData.userIdentities !== null && !self.isObject(identityApiData.userIdentities)) {
                return {
                  valid: false,
                  error: Constants.Messages.ValidationMessages.UserIdentities
                };
              }

              if (self.isObject(identityApiData.userIdentities) && Object.keys(identityApiData.userIdentities).length) {
                for (var identityType in identityApiData.userIdentities) {
                  if (identityApiData.userIdentities.hasOwnProperty(identityType)) {
                    if (Types.IdentityType.getIdentityType(identityType) === false) {
                      return {
                        valid: false,
                        error: Constants.Messages.ValidationMessages.UserIdentitiesInvalidKey
                      };
                    }

                    if (!(typeof identityApiData.userIdentities[identityType] === 'string' || identityApiData.userIdentities[identityType] === null)) {
                      return {
                        valid: false,
                        error: Constants.Messages.ValidationMessages.UserIdentitiesInvalidValues
                      };
                    }
                  }
                }
              }
            }
          }

          return {
            valid: true
          };
        }
      };

      this.isDelayedByIntegration = function (delayedIntegrations, timeoutStart, now) {
        if (now - timeoutStart > mpInstance._Store.SDKConfig.integrationDelayTimeout) {
          return false;
        }

        for (var integration in delayedIntegrations) {
          if (delayedIntegrations[integration] === true) {
            return true;
          } else {
            continue;
          }
        }

        return false;
      };

      this.createMainStorageName = function (workspaceToken) {
        if (workspaceToken) {
          return StorageNames.currentStorageName + '_' + workspaceToken;
        } else {
          return StorageNames.currentStorageName;
        }
      };

      this.createProductStorageName = function (workspaceToken) {
        if (workspaceToken) {
          return StorageNames.currentStorageProductsName + '_' + workspaceToken;
        } else {
          return StorageNames.currentStorageProductsName;
        }
      };

      this.isSlug = function (str) {
        return str === slugify(str);
      };
    }

    var Messages$1 = Constants.Messages;
    var androidBridgeNameBase = 'mParticleAndroid';
    var iosBridgeNameBase = 'mParticle';
    function NativeSdkHelpers(mpInstance) {
      var self = this;

      this.isBridgeV2Available = function (bridgeName) {
        if (!bridgeName) {
          return false;
        }

        var androidBridgeName = androidBridgeNameBase + '_' + bridgeName + '_v2';
        var iosBridgeName = iosBridgeNameBase + '_' + bridgeName + '_v2'; // iOS v2 bridge

        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.hasOwnProperty(iosBridgeName)) {
          return true;
        } // other iOS v2 bridge
        // TODO: what to do about people setting things on mParticle itself?


        if (window.mParticle && window.mParticle.uiwebviewBridgeName && window.mParticle.uiwebviewBridgeName === iosBridgeName) {
          return true;
        } // android


        if (window.hasOwnProperty(androidBridgeName)) {
          return true;
        }

        return false;
      };

      this.isWebviewEnabled = function (requiredWebviewBridgeName, minWebviewBridgeVersion) {
        mpInstance._Store.bridgeV2Available = self.isBridgeV2Available(requiredWebviewBridgeName);
        mpInstance._Store.bridgeV1Available = self.isBridgeV1Available();

        if (minWebviewBridgeVersion === 2) {
          return mpInstance._Store.bridgeV2Available;
        } // iOS BridgeV1 can be available via mParticle.isIOS, but return false if uiwebviewBridgeName doesn't match requiredWebviewBridgeName


        if (window.mParticle) {
          if (window.mParticle.uiwebviewBridgeName && window.mParticle.uiwebviewBridgeName !== iosBridgeNameBase + '_' + requiredWebviewBridgeName + '_v2') {
            return false;
          }
        }

        if (minWebviewBridgeVersion < 2) {
          // ios
          return mpInstance._Store.bridgeV2Available || mpInstance._Store.bridgeV1Available;
        }

        return false;
      };

      this.isBridgeV1Available = function () {
        if (mpInstance._Store.SDKConfig.useNativeSdk || window.mParticleAndroid || mpInstance._Store.SDKConfig.isIOS) {
          return true;
        }

        return false;
      };

      this.sendToNative = function (path, value) {
        if (mpInstance._Store.bridgeV2Available && mpInstance._Store.SDKConfig.minWebviewBridgeVersion === 2) {
          self.sendViaBridgeV2(path, value, mpInstance._Store.SDKConfig.requiredWebviewBridgeName);
          return;
        }

        if (mpInstance._Store.bridgeV2Available && mpInstance._Store.SDKConfig.minWebviewBridgeVersion < 2) {
          self.sendViaBridgeV2(path, value, mpInstance._Store.SDKConfig.requiredWebviewBridgeName);
          return;
        }

        if (mpInstance._Store.bridgeV1Available && mpInstance._Store.SDKConfig.minWebviewBridgeVersion < 2) {
          self.sendViaBridgeV1(path, value);
          return;
        }
      };

      this.sendViaBridgeV1 = function (path, value) {
        if (window.mParticleAndroid && window.mParticleAndroid.hasOwnProperty(path)) {
          mpInstance.Logger.verbose(Messages$1.InformationMessages.SendAndroid + path);
          window.mParticleAndroid[path](value);
        } else if (mpInstance._Store.SDKConfig.isIOS) {
          mpInstance.Logger.verbose(Messages$1.InformationMessages.SendIOS + path);
          self.sendViaIframeToIOS(path, value);
        }
      };

      this.sendViaIframeToIOS = function (path, value) {
        var iframe = document.createElement('IFRAME');
        iframe.setAttribute('src', 'mp-sdk://' + path + '/' + encodeURIComponent(value));
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
      };

      this.sendViaBridgeV2 = function (path, value, requiredWebviewBridgeName) {
        if (!requiredWebviewBridgeName) {
          return;
        }

        var androidBridgeName = androidBridgeNameBase + '_' + requiredWebviewBridgeName + '_v2',
            androidBridge = window[androidBridgeName],
            iosBridgeName = iosBridgeNameBase + '_' + requiredWebviewBridgeName + '_v2',
            iOSBridgeMessageHandler,
            iOSBridgeNonMessageHandler;

        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers[iosBridgeName]) {
          iOSBridgeMessageHandler = window.webkit.messageHandlers[iosBridgeName];
        }

        if (mpInstance.uiwebviewBridgeName === iosBridgeName) {
          iOSBridgeNonMessageHandler = mpInstance[iosBridgeName];
        }

        if (androidBridge && androidBridge.hasOwnProperty(path)) {
          mpInstance.Logger.verbose(Messages$1.InformationMessages.SendAndroid + path);
          androidBridge[path](value);
          return;
        } else if (iOSBridgeMessageHandler) {
          mpInstance.Logger.verbose(Messages$1.InformationMessages.SendIOS + path);
          iOSBridgeMessageHandler.postMessage(JSON.stringify({
            path: path,
            value: value ? JSON.parse(value) : null
          }));
        } else if (iOSBridgeNonMessageHandler) {
          mpInstance.Logger.verbose(Messages$1.InformationMessages.SendIOS + path);
          self.sendViaIframeToIOS(path, value);
        }
      };
    }

    var Messages$2 = Constants.Messages;
    function cookieSyncManager(mpInstance) {
      var self = this;

      this.attemptCookieSync = function (previousMPID, mpid, mpidIsNotInCookies) {
        var pixelConfig, lastSyncDateForModule, url, redirect, urlWithRedirect, requiresConsent;

        if (mpid && !mpInstance._Store.webviewBridgeEnabled) {
          mpInstance._Store.pixelConfigurations.forEach(function (pixelSettings) {
            // set requiresConsent to false to start each additional pixel configuration
            // set to true only if filteringConsenRuleValues.values.length exists
            requiresConsent = false;

            if (pixelSettings.filteringConsentRuleValues && pixelSettings.filteringConsentRuleValues.values && pixelSettings.filteringConsentRuleValues.values.length) {
              requiresConsent = true;
            }

            pixelConfig = {
              moduleId: pixelSettings.moduleId,
              frequencyCap: pixelSettings.frequencyCap,
              pixelUrl: self.replaceAmp(pixelSettings.pixelUrl),
              redirectUrl: pixelSettings.redirectUrl ? self.replaceAmp(pixelSettings.redirectUrl) : null,
              filteringConsentRuleValues: pixelSettings.filteringConsentRuleValues
            };
            url = self.replaceMPID(pixelConfig.pixelUrl, mpid);
            redirect = pixelConfig.redirectUrl ? self.replaceMPID(pixelConfig.redirectUrl, mpid) : '';
            urlWithRedirect = url + encodeURIComponent(redirect);

            var persistence = mpInstance._Persistence.getPersistence();

            if (previousMPID && previousMPID !== mpid) {
              if (persistence && persistence[mpid]) {
                if (!persistence[mpid].csd) {
                  persistence[mpid].csd = {};
                }

                self.performCookieSync(urlWithRedirect, pixelConfig.moduleId, mpid, persistence[mpid].csd, pixelConfig.filteringConsentRuleValues, mpidIsNotInCookies, requiresConsent);
              }

              return;
            } else {
              if (persistence[mpid]) {
                if (!persistence[mpid].csd) {
                  persistence[mpid].csd = {};
                }

                lastSyncDateForModule = persistence[mpid].csd[pixelConfig.moduleId.toString()] ? persistence[mpid].csd[pixelConfig.moduleId.toString()] : null;

                if (lastSyncDateForModule) {
                  // Check to see if we need to refresh cookieSync
                  if (new Date().getTime() > new Date(lastSyncDateForModule).getTime() + pixelConfig.frequencyCap * 60 * 1000 * 60 * 24) {
                    self.performCookieSync(urlWithRedirect, pixelConfig.moduleId, mpid, persistence[mpid].csd, pixelConfig.filteringConsentRuleValues, mpidIsNotInCookies, requiresConsent);
                  }
                } else {
                  self.performCookieSync(urlWithRedirect, pixelConfig.moduleId, mpid, persistence[mpid].csd, pixelConfig.filteringConsentRuleValues, mpidIsNotInCookies, requiresConsent);
                }
              }
            }
          });
        }
      };

      this.replaceMPID = function (string, mpid) {
        return string.replace('%%mpid%%', mpid);
      };

      this.replaceAmp = function (string) {
        return string.replace(/&amp;/g, '&');
      };

      this.performCookieSync = function (url, moduleId, mpid, cookieSyncDates, filteringConsentRuleValues, mpidIsNotInCookies, requiresConsent) {
        // if MPID is new to cookies, we should not try to perform the cookie sync
        // because a cookie sync can only occur once a user either consents or doesn't
        // we should not check if its enabled if the user has a blank consent
        if (requiresConsent && mpidIsNotInCookies) {
          return;
        }

        if (mpInstance._Consent.isEnabledForUserConsent(filteringConsentRuleValues, mpInstance.Identity.getCurrentUser())) {
          var img = document.createElement('img');
          mpInstance.Logger.verbose(Messages$2.InformationMessages.CookieSync);
          img.src = url;
          cookieSyncDates[moduleId.toString()] = new Date().getTime();

          mpInstance._Persistence.saveUserCookieSyncDatesToPersistence(mpid, cookieSyncDates);
        }
      };
    }

    var Messages$3 = Constants.Messages;

    function SessionManager(mpInstance) {
      var self = this;

      this.initialize = function () {
        if (mpInstance._Store.sessionId) {
          var sessionTimeoutInMilliseconds = mpInstance._Store.SDKConfig.sessionTimeout * 60000;

          if (new Date() > new Date(mpInstance._Store.dateLastEventSent.getTime() + sessionTimeoutInMilliseconds)) {
            self.endSession();
            self.startNewSession();
          } else {
            var persistence = mpInstance._Persistence.getPersistence();

            if (persistence && !persistence.cu) {
              mpInstance.Identity.identify(mpInstance._Store.SDKConfig.identifyRequest, mpInstance._Store.SDKConfig.identityCallback);
              mpInstance._Store.identifyCalled = true;
              mpInstance._Store.SDKConfig.identityCallback = null;
            }
          }
        } else {
          self.startNewSession();
        }
      };

      this.getSession = function () {
        return mpInstance._Store.sessionId;
      };

      this.startNewSession = function () {
        mpInstance.Logger.verbose(Messages$3.InformationMessages.StartingNewSession);

        if (mpInstance._Helpers.canLog()) {
          mpInstance._Store.sessionId = mpInstance._Helpers.generateUniqueId().toUpperCase();
          var currentUser = mpInstance.Identity.getCurrentUser(),
              mpid = currentUser ? currentUser.getMPID() : null;

          if (mpid) {
            mpInstance._Store.currentSessionMPIDs = [mpid];
          }

          if (!mpInstance._Store.sessionStartDate) {
            var date = new Date();
            mpInstance._Store.sessionStartDate = date;
            mpInstance._Store.dateLastEventSent = date;
          }

          self.setSessionTimer();

          if (!mpInstance._Store.identifyCalled) {
            mpInstance.Identity.identify(mpInstance._Store.SDKConfig.identifyRequest, mpInstance._Store.SDKConfig.identityCallback);
            mpInstance._Store.identifyCalled = true;
            mpInstance._Store.SDKConfig.identityCallback = null;
          }

          mpInstance._Events.logEvent({
            messageType: Types.MessageType.SessionStart
          });
        } else {
          mpInstance.Logger.verbose(Messages$3.InformationMessages.AbandonStartSession);
        }
      };

      this.endSession = function (override) {
        mpInstance.Logger.verbose(Messages$3.InformationMessages.StartingEndSession);

        if (override) {
          mpInstance._Events.logEvent({
            messageType: Types.MessageType.SessionEnd
          });

          mpInstance._Store.sessionId = null;
          mpInstance._Store.dateLastEventSent = null;
          mpInstance._Store.sessionAttributes = {};

          mpInstance._Persistence.update();
        } else if (mpInstance._Helpers.canLog()) {
          var sessionTimeoutInMilliseconds, cookies, timeSinceLastEventSent;
          cookies = mpInstance._Persistence.getPersistence();

          if (!cookies) {
            return;
          }

          if (cookies.gs && !cookies.gs.sid) {
            mpInstance.Logger.verbose(Messages$3.InformationMessages.NoSessionToEnd);
            return;
          } // sessionId is not equal to cookies.sid if cookies.sid is changed in another tab


          if (cookies.gs.sid && mpInstance._Store.sessionId !== cookies.gs.sid) {
            mpInstance._Store.sessionId = cookies.gs.sid;
          }

          if (cookies.gs && cookies.gs.les) {
            sessionTimeoutInMilliseconds = mpInstance._Store.SDKConfig.sessionTimeout * 60000;
            var newDate = new Date().getTime();
            timeSinceLastEventSent = newDate - cookies.gs.les;

            if (timeSinceLastEventSent < sessionTimeoutInMilliseconds) {
              self.setSessionTimer();
            } else {
              mpInstance._Events.logEvent({
                messageType: Types.MessageType.SessionEnd
              });

              mpInstance._Store.sessionId = null;
              mpInstance._Store.dateLastEventSent = null;
              mpInstance._Store.sessionStartDate = null;
              mpInstance._Store.sessionAttributes = {};

              mpInstance._Persistence.update();
            }
          }
        } else {
          mpInstance.Logger.verbose(Messages$3.InformationMessages.AbandonEndSession);
        }
      };

      this.setSessionTimer = function () {
        var sessionTimeoutInMilliseconds = mpInstance._Store.SDKConfig.sessionTimeout * 60000;
        mpInstance._Store.globalTimer = window.setTimeout(function () {
          self.endSession();
        }, sessionTimeoutInMilliseconds);
      };

      this.resetSessionTimer = function () {
        if (!mpInstance._Store.webviewBridgeEnabled) {
          if (!mpInstance._Store.sessionId) {
            self.startNewSession();
          }

          self.clearSessionTimeout();
          self.setSessionTimer();
        }

        self.startNewSessionIfNeeded();
      };

      this.clearSessionTimeout = function () {
        clearTimeout(mpInstance._Store.globalTimer);
      };

      this.startNewSessionIfNeeded = function () {
        if (!mpInstance._Store.webviewBridgeEnabled) {
          var persistence = mpInstance._Persistence.getPersistence();

          if (!mpInstance._Store.sessionId && persistence) {
            if (persistence.sid) {
              mpInstance._Store.sessionId = persistence.sid;
            } else {
              self.startNewSession();
            }
          }
        }
      };
    }

    var Messages$4 = Constants.Messages;
    function Ecommerce(mpInstance) {
      var self = this;

      this.convertTransactionAttributesToProductAction = function (transactionAttributes, productAction) {
        if (transactionAttributes.hasOwnProperty('Id')) {
          productAction.TransactionId = transactionAttributes.Id;
        }

        if (transactionAttributes.hasOwnProperty('Affiliation')) {
          productAction.Affiliation = transactionAttributes.Affiliation;
        }

        if (transactionAttributes.hasOwnProperty('CouponCode')) {
          productAction.CouponCode = transactionAttributes.CouponCode;
        }

        if (transactionAttributes.hasOwnProperty('Revenue')) {
          productAction.TotalAmount = this.sanitizeAmount(transactionAttributes.Revenue, 'Revenue');
        }

        if (transactionAttributes.hasOwnProperty('Shipping')) {
          productAction.ShippingAmount = this.sanitizeAmount(transactionAttributes.Shipping, 'Shipping');
        }

        if (transactionAttributes.hasOwnProperty('Tax')) {
          productAction.TaxAmount = this.sanitizeAmount(transactionAttributes.Tax, 'Tax');
        }

        if (transactionAttributes.hasOwnProperty('Step')) {
          productAction.CheckoutStep = transactionAttributes.Step;
        }

        if (transactionAttributes.hasOwnProperty('Option')) {
          productAction.CheckoutOptions = transactionAttributes.Option;
        }
      };

      this.getProductActionEventName = function (productActionType) {
        switch (productActionType) {
          case Types.ProductActionType.AddToCart:
            return 'AddToCart';

          case Types.ProductActionType.AddToWishlist:
            return 'AddToWishlist';

          case Types.ProductActionType.Checkout:
            return 'Checkout';

          case Types.ProductActionType.CheckoutOption:
            return 'CheckoutOption';

          case Types.ProductActionType.Click:
            return 'Click';

          case Types.ProductActionType.Purchase:
            return 'Purchase';

          case Types.ProductActionType.Refund:
            return 'Refund';

          case Types.ProductActionType.RemoveFromCart:
            return 'RemoveFromCart';

          case Types.ProductActionType.RemoveFromWishlist:
            return 'RemoveFromWishlist';

          case Types.ProductActionType.ViewDetail:
            return 'ViewDetail';

          case Types.ProductActionType.Unknown:
          default:
            return 'Unknown';
        }
      };

      this.getPromotionActionEventName = function (promotionActionType) {
        switch (promotionActionType) {
          case Types.PromotionActionType.PromotionClick:
            return 'PromotionClick';

          case Types.PromotionActionType.PromotionView:
            return 'PromotionView';

          default:
            return 'Unknown';
        }
      };

      this.convertProductActionToEventType = function (productActionType) {
        switch (productActionType) {
          case Types.ProductActionType.AddToCart:
            return Types.CommerceEventType.ProductAddToCart;

          case Types.ProductActionType.AddToWishlist:
            return Types.CommerceEventType.ProductAddToWishlist;

          case Types.ProductActionType.Checkout:
            return Types.CommerceEventType.ProductCheckout;

          case Types.ProductActionType.CheckoutOption:
            return Types.CommerceEventType.ProductCheckoutOption;

          case Types.ProductActionType.Click:
            return Types.CommerceEventType.ProductClick;

          case Types.ProductActionType.Purchase:
            return Types.CommerceEventType.ProductPurchase;

          case Types.ProductActionType.Refund:
            return Types.CommerceEventType.ProductRefund;

          case Types.ProductActionType.RemoveFromCart:
            return Types.CommerceEventType.ProductRemoveFromCart;

          case Types.ProductActionType.RemoveFromWishlist:
            return Types.CommerceEventType.ProductRemoveFromWishlist;

          case Types.ProductActionType.Unknown:
            return Types.EventType.Unknown;

          case Types.ProductActionType.ViewDetail:
            return Types.CommerceEventType.ProductViewDetail;

          default:
            mpInstance.Logger.error('Could not convert product action type ' + productActionType + ' to event type');
            return null;
        }
      };

      this.convertPromotionActionToEventType = function (promotionActionType) {
        switch (promotionActionType) {
          case Types.PromotionActionType.PromotionClick:
            return Types.CommerceEventType.PromotionClick;

          case Types.PromotionActionType.PromotionView:
            return Types.CommerceEventType.PromotionView;

          default:
            mpInstance.Logger.error('Could not convert promotion action type ' + promotionActionType + ' to event type');
            return null;
        }
      };

      this.generateExpandedEcommerceName = function (eventName, plusOne) {
        return 'eCommerce - ' + eventName + ' - ' + (plusOne ? 'Total' : 'Item');
      };

      this.extractProductAttributes = function (attributes, product) {
        if (product.CouponCode) {
          attributes['Coupon Code'] = product.CouponCode;
        }

        if (product.Brand) {
          attributes['Brand'] = product.Brand;
        }

        if (product.Category) {
          attributes['Category'] = product.Category;
        }

        if (product.Name) {
          attributes['Name'] = product.Name;
        }

        if (product.Sku) {
          attributes['Id'] = product.Sku;
        }

        if (product.Price) {
          attributes['Item Price'] = product.Price;
        }

        if (product.Quantity) {
          attributes['Quantity'] = product.Quantity;
        }

        if (product.Position) {
          attributes['Position'] = product.Position;
        }

        if (product.Variant) {
          attributes['Variant'] = product.Variant;
        }

        attributes['Total Product Amount'] = product.TotalAmount || 0;
      };

      this.extractTransactionId = function (attributes, productAction) {
        if (productAction.TransactionId) {
          attributes['Transaction Id'] = productAction.TransactionId;
        }
      };

      this.extractActionAttributes = function (attributes, productAction) {
        self.extractTransactionId(attributes, productAction);

        if (productAction.Affiliation) {
          attributes['Affiliation'] = productAction.Affiliation;
        }

        if (productAction.CouponCode) {
          attributes['Coupon Code'] = productAction.CouponCode;
        }

        if (productAction.TotalAmount) {
          attributes['Total Amount'] = productAction.TotalAmount;
        }

        if (productAction.ShippingAmount) {
          attributes['Shipping Amount'] = productAction.ShippingAmount;
        }

        if (productAction.TaxAmount) {
          attributes['Tax Amount'] = productAction.TaxAmount;
        }

        if (productAction.CheckoutOptions) {
          attributes['Checkout Options'] = productAction.CheckoutOptions;
        }

        if (productAction.CheckoutStep) {
          attributes['Checkout Step'] = productAction.CheckoutStep;
        }
      };

      this.extractPromotionAttributes = function (attributes, promotion) {
        if (promotion.Id) {
          attributes['Id'] = promotion.Id;
        }

        if (promotion.Creative) {
          attributes['Creative'] = promotion.Creative;
        }

        if (promotion.Name) {
          attributes['Name'] = promotion.Name;
        }

        if (promotion.Position) {
          attributes['Position'] = promotion.Position;
        }
      };

      this.buildProductList = function (event, product) {
        if (product) {
          if (Array.isArray(product)) {
            return product;
          }

          return [product];
        }

        return event.ShoppingCart.ProductList;
      };

      this.createProduct = function (name, sku, price, quantity, variant, category, brand, position, couponCode, attributes) {
        attributes = mpInstance._Helpers.sanitizeAttributes(attributes, name);

        if (typeof name !== 'string') {
          mpInstance.Logger.error('Name is required when creating a product');
          return null;
        }

        if (!mpInstance._Helpers.Validators.isStringOrNumber(sku)) {
          mpInstance.Logger.error('SKU is required when creating a product, and must be a string or a number');
          return null;
        }

        if (!mpInstance._Helpers.Validators.isStringOrNumber(price)) {
          mpInstance.Logger.error('Price is required when creating a product, and must be a string or a number');
          return null;
        } else {
          price = mpInstance._Helpers.parseNumber(price);
        }

        if (position && !mpInstance._Helpers.Validators.isNumber(position)) {
          mpInstance.Logger.error('Position must be a number, it will be set to null.');
          position = null;
        }

        if (!mpInstance._Helpers.Validators.isStringOrNumber(quantity)) {
          quantity = 1;
        } else {
          quantity = mpInstance._Helpers.parseNumber(quantity);
        }

        return {
          Name: name,
          Sku: sku,
          Price: price,
          Quantity: quantity,
          Brand: brand,
          Variant: variant,
          Category: category,
          Position: position,
          CouponCode: couponCode,
          TotalAmount: quantity * price,
          Attributes: attributes
        };
      };

      this.createPromotion = function (id, creative, name, position) {
        if (!mpInstance._Helpers.Validators.isStringOrNumber(id)) {
          mpInstance.Logger.error(Messages$4.ErrorMessages.PromotionIdRequired);
          return null;
        }

        return {
          Id: id,
          Creative: creative,
          Name: name,
          Position: position
        };
      };

      this.createImpression = function (name, product) {
        if (typeof name !== 'string') {
          mpInstance.Logger.error('Name is required when creating an impression.');
          return null;
        }

        if (!product) {
          mpInstance.Logger.error('Product is required when creating an impression.');
          return null;
        }

        return {
          Name: name,
          Product: product
        };
      };

      this.createTransactionAttributes = function (id, affiliation, couponCode, revenue, shipping, tax) {
        if (!mpInstance._Helpers.Validators.isStringOrNumber(id)) {
          mpInstance.Logger.error(Messages$4.ErrorMessages.TransactionIdRequired);
          return null;
        }

        return {
          Id: id,
          Affiliation: affiliation,
          CouponCode: couponCode,
          Revenue: revenue,
          Shipping: shipping,
          Tax: tax
        };
      };

      this.expandProductImpression = function (commerceEvent) {
        var appEvents = [];

        if (!commerceEvent.ProductImpressions) {
          return appEvents;
        }

        commerceEvent.ProductImpressions.forEach(function (productImpression) {
          if (productImpression.ProductList) {
            productImpression.ProductList.forEach(function (product) {
              var attributes = mpInstance._Helpers.extend(false, {}, commerceEvent.EventAttributes);

              if (product.Attributes) {
                for (var attribute in product.Attributes) {
                  attributes[attribute] = product.Attributes[attribute];
                }
              }

              self.extractProductAttributes(attributes, product);

              if (productImpression.ProductImpressionList) {
                attributes['Product Impression List'] = productImpression.ProductImpressionList;
              }

              var appEvent = mpInstance._ServerModel.createEventObject({
                messageType: Types.MessageType.PageEvent,
                name: self.generateExpandedEcommerceName('Impression'),
                data: attributes,
                eventType: Types.EventType.Transaction
              });

              appEvents.push(appEvent);
            });
          }
        });
        return appEvents;
      };

      this.expandCommerceEvent = function (event) {
        if (!event) {
          return null;
        }

        return self.expandProductAction(event).concat(self.expandPromotionAction(event)).concat(self.expandProductImpression(event));
      };

      this.expandPromotionAction = function (commerceEvent) {
        var appEvents = [];

        if (!commerceEvent.PromotionAction) {
          return appEvents;
        }

        var promotions = commerceEvent.PromotionAction.PromotionList;
        promotions.forEach(function (promotion) {
          var attributes = mpInstance._Helpers.extend(false, {}, commerceEvent.EventAttributes);

          self.extractPromotionAttributes(attributes, promotion);

          var appEvent = mpInstance._ServerModel.createEventObject({
            messageType: Types.MessageType.PageEvent,
            name: self.generateExpandedEcommerceName(Types.PromotionActionType.getExpansionName(commerceEvent.PromotionAction.PromotionActionType)),
            data: attributes,
            eventType: Types.EventType.Transaction
          });

          appEvents.push(appEvent);
        });
        return appEvents;
      };

      this.expandProductAction = function (commerceEvent) {
        var appEvents = [];

        if (!commerceEvent.ProductAction) {
          return appEvents;
        }

        var shouldExtractActionAttributes = false;

        if (commerceEvent.ProductAction.ProductActionType === Types.ProductActionType.Purchase || commerceEvent.ProductAction.ProductActionType === Types.ProductActionType.Refund) {
          var attributes = mpInstance._Helpers.extend(false, {}, commerceEvent.EventAttributes);

          attributes['Product Count'] = commerceEvent.ProductAction.ProductList ? commerceEvent.ProductAction.ProductList.length : 0;
          self.extractActionAttributes(attributes, commerceEvent.ProductAction);

          if (commerceEvent.CurrencyCode) {
            attributes['Currency Code'] = commerceEvent.CurrencyCode;
          }

          var plusOneEvent = mpInstance._ServerModel.createEventObject({
            messageType: Types.MessageType.PageEvent,
            name: self.generateExpandedEcommerceName(Types.ProductActionType.getExpansionName(commerceEvent.ProductAction.ProductActionType), true),
            data: attributes,
            eventType: Types.EventType.Transaction
          });

          appEvents.push(plusOneEvent);
        } else {
          shouldExtractActionAttributes = true;
        }

        var products = commerceEvent.ProductAction.ProductList;

        if (!products) {
          return appEvents;
        }

        products.forEach(function (product) {
          var attributes = mpInstance._Helpers.extend(false, commerceEvent.EventAttributes, product.Attributes);

          if (shouldExtractActionAttributes) {
            self.extractActionAttributes(attributes, commerceEvent.ProductAction);
          } else {
            self.extractTransactionId(attributes, commerceEvent.ProductAction);
          }

          self.extractProductAttributes(attributes, product);

          var productEvent = mpInstance._ServerModel.createEventObject({
            messageType: Types.MessageType.PageEvent,
            name: self.generateExpandedEcommerceName(Types.ProductActionType.getExpansionName(commerceEvent.ProductAction.ProductActionType)),
            data: attributes,
            eventType: Types.EventType.Transaction
          });

          appEvents.push(productEvent);
        });
        return appEvents;
      };

      this.createCommerceEventObject = function (customFlags) {
        var baseEvent;
        mpInstance.Logger.verbose(Messages$4.InformationMessages.StartingLogCommerceEvent);

        if (mpInstance._Helpers.canLog()) {
          baseEvent = mpInstance._ServerModel.createEventObject({
            messageType: Types.MessageType.Commerce
          });
          baseEvent.EventName = 'eCommerce - ';
          baseEvent.CurrencyCode = mpInstance._Store.currencyCode;
          baseEvent.ShoppingCart = [];
          baseEvent.CustomFlags = customFlags;
          return baseEvent;
        } else {
          mpInstance.Logger.verbose(Messages$4.InformationMessages.AbandonLogEvent);
        }

        return null;
      }; // sanitizes any non number, non string value to 0


      this.sanitizeAmount = function (amount, category) {
        if (!mpInstance._Helpers.Validators.isStringOrNumber(amount)) {
          var message = [category, 'must be of type number. A', _typeof(amount), 'was passed. Converting to 0'].join(' ');
          mpInstance.Logger.warning(message);
          return 0;
        } // if amount is a string, it will be parsed into a number if possible, or set to 0


        return mpInstance._Helpers.parseNumber(amount);
      };
    }

    function createSDKConfig(config) {
      var sdkConfig = {};

      for (var prop in Constants.DefaultConfig) {
        if (Constants.DefaultConfig.hasOwnProperty(prop)) {
          sdkConfig[prop] = Constants.DefaultConfig[prop];
        }
      }

      if (config) {
        for (prop in config) {
          if (config.hasOwnProperty(prop)) {
            sdkConfig[prop] = config[prop];
          }
        }
      }

      for (prop in Constants.DefaultUrls) {
        sdkConfig[prop] = Constants.DefaultUrls[prop];
      }

      return sdkConfig;
    }

    function Store(config, mpInstance) {
      var defaultStore = {
        isEnabled: true,
        sessionAttributes: {},
        currentSessionMPIDs: [],
        consentState: null,
        sessionId: null,
        isFirstRun: null,
        clientId: null,
        deviceId: null,
        devToken: null,
        migrationData: {},
        serverSettings: {},
        dateLastEventSent: null,
        sessionStartDate: null,
        currentPosition: null,
        isTracking: false,
        watchPositionId: null,
        cartProducts: [],
        eventQueue: [],
        currencyCode: null,
        globalTimer: null,
        context: '',
        configurationLoaded: false,
        identityCallInFlight: false,
        SDKConfig: {},
        migratingToIDSyncCookies: false,
        nonCurrentUserMPIDs: {},
        identifyCalled: false,
        isLoggedIn: false,
        cookieSyncDates: {},
        integrationAttributes: {},
        requireDelay: true,
        isLocalStorageAvailable: null,
        storageName: null,
        prodStorageName: null,
        activeForwarders: [],
        kits: {},
        configuredForwarders: [],
        pixelConfigurations: []
      };

      for (var key in defaultStore) {
        this[key] = defaultStore[key];
      }

      this.integrationDelayTimeoutStart = Date.now();
      this.SDKConfig = createSDKConfig(config); // Set configuration to default settings

      if (config) {
        if (config.hasOwnProperty('isDevelopmentMode')) {
          this.SDKConfig.isDevelopmentMode = mpInstance._Helpers.returnConvertedBoolean(config.isDevelopmentMode);
        } else {
          this.SDKConfig.isDevelopmentMode = false;
        }

        if (config.hasOwnProperty('v1SecureServiceUrl')) {
          this.SDKConfig.v1SecureServiceUrl = config.v1SecureServiceUrl;
        }

        if (config.hasOwnProperty('v2SecureServiceUrl')) {
          this.SDKConfig.v2SecureServiceUrl = config.v2SecureServiceUrl;
        }

        if (config.hasOwnProperty('v3SecureServiceUrl')) {
          this.SDKConfig.v3SecureServiceUrl = config.v3SecureServiceUrl;
        }

        if (config.hasOwnProperty('identityUrl')) {
          this.SDKConfig.identityUrl = config.identityUrl;
        }

        if (config.hasOwnProperty('aliasUrl')) {
          this.SDKConfig.aliasUrl = config.aliasUrl;
        }

        if (config.hasOwnProperty('configUrl')) {
          this.SDKConfig.configUrl = config.configUrl;
        }

        if (config.hasOwnProperty('logLevel')) {
          this.SDKConfig.logLevel = config.logLevel;
        }

        if (config.hasOwnProperty('useNativeSdk')) {
          this.SDKConfig.useNativeSdk = config.useNativeSdk;
        } else {
          this.SDKConfig.useNativeSdk = false;
        }

        if (config.hasOwnProperty('kits')) {
          this.SDKConfig.kits = config.kits;
        }

        if (config.hasOwnProperty('isIOS')) {
          this.SDKConfig.isIOS = config.isIOS;
        } else {
          this.SDKConfig.isIOS = window.mParticle && window.mParticle.isIOS ? window.mParticle.isIOS : false;
        }

        if (config.hasOwnProperty('useCookieStorage')) {
          this.SDKConfig.useCookieStorage = config.useCookieStorage;
        } else {
          this.SDKConfig.useCookieStorage = false;
        }

        if (config.hasOwnProperty('maxProducts')) {
          this.SDKConfig.maxProducts = config.maxProducts;
        } else {
          this.SDKConfig.maxProducts = Constants.DefaultConfig.maxProducts;
        }

        if (config.hasOwnProperty('maxCookieSize')) {
          this.SDKConfig.maxCookieSize = config.maxCookieSize;
        } else {
          this.SDKConfig.maxCookieSize = Constants.DefaultConfig.maxCookieSize;
        }

        if (config.hasOwnProperty('appName')) {
          this.SDKConfig.appName = config.appName;
        }

        if (config.hasOwnProperty('integrationDelayTimeout')) {
          this.SDKConfig.integrationDelayTimeout = config.integrationDelayTimeout;
        } else {
          this.SDKConfig.integrationDelayTimeout = Constants.DefaultConfig.integrationDelayTimeout;
        }

        if (config.hasOwnProperty('identifyRequest')) {
          this.SDKConfig.identifyRequest = config.identifyRequest;
        }

        if (config.hasOwnProperty('identityCallback')) {
          var callback = config.identityCallback;

          if (mpInstance._Helpers.Validators.isFunction(callback)) {
            this.SDKConfig.identityCallback = config.identityCallback;
          } else {
            mpInstance.Logger.warning('The optional callback must be a function. You tried entering a(n) ' + _typeof(callback), ' . Callback not set. Please set your callback again.');
          }
        }

        if (config.hasOwnProperty('appVersion')) {
          this.SDKConfig.appVersion = config.appVersion;
        }

        if (config.hasOwnProperty('appName')) {
          this.SDKConfig.appName = config.appName;
        }

        if (config.hasOwnProperty('sessionTimeout')) {
          this.SDKConfig.sessionTimeout = config.sessionTimeout;
        }

        if (config.hasOwnProperty('dataPlan')) {
          this.SDKConfig.dataPlan = {
            PlanVersion: null,
            PlanId: null
          };

          if (config.dataPlan.hasOwnProperty('planId')) {
            if (typeof config.dataPlan.planId === 'string') {
              if (mpInstance._Helpers.isSlug(config.dataPlan.planId)) {
                this.SDKConfig.dataPlan.PlanId = config.dataPlan.planId;
              } else {
                mpInstance.Logger.error('Your data plan id must be in a slug format');
              }
            } else {
              mpInstance.Logger.error('Your data plan id must be a string');
            }
          }

          if (config.dataPlan.hasOwnProperty('planVersion')) {
            if (typeof config.dataPlan.planVersion === 'number') {
              this.SDKConfig.dataPlan.PlanVersion = config.dataPlan.planVersion;
            } else {
              mpInstance.Logger.error('Your data plan version must be a number');
            }
          }
        }

        if (config.hasOwnProperty('forceHttps')) {
          this.SDKConfig.forceHttps = config.forceHttps;
        } else {
          this.SDKConfig.forceHttps = true;
        } // Some forwarders require custom flags on initialization, so allow them to be set using config object


        if (config.hasOwnProperty('customFlags')) {
          this.SDKConfig.customFlags = config.customFlags;
        }

        if (config.hasOwnProperty('minWebviewBridgeVersion')) {
          this.SDKConfig.minWebviewBridgeVersion = config.minWebviewBridgeVersion;
        } else {
          this.SDKConfig.minWebviewBridgeVersion = 1;
        }

        if (config.hasOwnProperty('aliasMaxWindow')) {
          this.SDKConfig.aliasMaxWindow = config.aliasMaxWindow;
        } else {
          this.SDKConfig.aliasMaxWindow = Constants.DefaultConfig.aliasMaxWindow;
        }

        if (config.hasOwnProperty('dataPlanOptions')) {
          var dataPlanOptions = config.dataPlanOptions;

          if (!dataPlanOptions.hasOwnProperty('dataPlanVersion') || !dataPlanOptions.hasOwnProperty('blockUserAttributes') || !dataPlanOptions.hasOwnProperty('blockEventAttributes') || !dataPlanOptions.hasOwnProperty('blockEvents') || !dataPlanOptions.hasOwnProperty('blockUserIdentities')) {
            mpInstance.Logger.error('Ensure your config.dataPlanOptions object has the following keys: a "dataPlanVersion" object, and "blockUserAttributes", "blockEventAttributes", "blockEvents", "blockUserIdentities" booleans');
          }
        }

        if (!config.hasOwnProperty('flags')) {
          this.SDKConfig.flags = {};
        }

        if (!this.SDKConfig.flags.hasOwnProperty(Constants.FeatureFlags.EventsV3)) {
          this.SDKConfig.flags[Constants.FeatureFlags.EventsV3] = 0;
        }

        if (!this.SDKConfig.flags.hasOwnProperty(Constants.FeatureFlags.EventBatchingIntervalMillis)) {
          this.SDKConfig.flags[Constants.FeatureFlags.EventBatchingIntervalMillis] = Constants.DefaultConfig.uploadInterval;
        }

        if (!this.SDKConfig.flags.hasOwnProperty(Constants.FeatureFlags.ReportBatching)) {
          this.SDKConfig.flags[Constants.FeatureFlags.ReportBatching] = false;
        }
      }
    }

    function Logger(config) {
      var self = this;
      var logLevel = config.logLevel || 'warning';

      if (config.hasOwnProperty('logger')) {
        this.logger = config.logger;
      } else {
        this.logger = new ConsoleLogger();
      }

      this.verbose = function (msg) {
        if (logLevel !== 'none') {
          if (self.logger.verbose && logLevel === 'verbose') {
            self.logger.verbose(msg);
          }
        }
      };

      this.warning = function (msg) {
        if (logLevel !== 'none') {
          if (self.logger.warning && (logLevel === 'verbose' || logLevel === 'warning')) {
            self.logger.warning(msg);
          }
        }
      };

      this.error = function (msg) {
        if (logLevel !== 'none') {
          if (self.logger.error) {
            self.logger.error(msg);
          }
        }
      };

      this.setLogLevel = function (newLogLevel) {
        logLevel = newLogLevel;
      };
    }

    function ConsoleLogger() {
      this.verbose = function (msg) {
        if (console && console.info) {
          console.info(msg);
        }
      };

      this.error = function (msg) {
        if (console && console.error) {
          console.error(msg);
        }
      };

      this.warning = function (msg) {
        if (console && console.warn) {
          console.warn(msg);
        }
      };
    }

    var Base64$1 = Polyfill.Base64,
        Messages$5 = Constants.Messages,
        Base64CookieKeys = Constants.Base64CookieKeys,
        SDKv2NonMPIDCookieKeys = Constants.SDKv2NonMPIDCookieKeys,
        StorageNames$1 = Constants.StorageNames;
    function _Persistence(mpInstance) {
      var self = this;

      this.useLocalStorage = function () {
        return !mpInstance._Store.SDKConfig.useCookieStorage && mpInstance._Store.isLocalStorageAvailable;
      };

      this.initializeStorage = function () {
        try {
          var storage,
              localStorageData = self.getLocalStorage(),
              cookies = self.getCookie(),
              allData; // Determine if there is any data in cookies or localStorage to figure out if it is the first time the browser is loading mParticle

          if (!localStorageData && !cookies) {
            mpInstance._Store.isFirstRun = true;
            mpInstance._Store.mpid = 0;
          } else {
            mpInstance._Store.isFirstRun = false;
          }

          if (!mpInstance._Store.isLocalStorageAvailable) {
            mpInstance._Store.SDKConfig.useCookieStorage = true;
          }

          if (mpInstance._Store.isLocalStorageAvailable) {
            storage = window.localStorage;

            if (mpInstance._Store.SDKConfig.useCookieStorage) {
              // For migrating from localStorage to cookies -- If an instance switches from localStorage to cookies, then
              // no mParticle cookie exists yet and there is localStorage. Get the localStorage, set them to cookies, then delete the localStorage item.
              if (localStorageData) {
                if (cookies) {
                  allData = mpInstance._Helpers.extend(false, localStorageData, cookies);
                } else {
                  allData = localStorageData;
                }

                storage.removeItem(mpInstance._Store.storageName);
              } else if (cookies) {
                allData = cookies;
              }

              self.storeDataInMemory(allData);
            } else {
              // For migrating from cookie to localStorage -- If an instance is newly switching from cookies to localStorage, then
              // no mParticle localStorage exists yet and there are cookies. Get the cookies, set them to localStorage, then delete the cookies.
              if (cookies) {
                if (localStorageData) {
                  allData = mpInstance._Helpers.extend(false, localStorageData, cookies);
                } else {
                  allData = cookies;
                }

                self.storeDataInMemory(allData);
                self.expireCookies(mpInstance._Store.storageName);
              } else {
                self.storeDataInMemory(localStorageData);
              }
            }
          } else {
            self.storeDataInMemory(cookies);
          }

          try {
            if (mpInstance._Store.isLocalStorageAvailable) {
              var encodedProducts = localStorage.getItem(mpInstance._Store.prodStorageName);

              if (encodedProducts) {
                var decodedProducts = JSON.parse(Base64$1.decode(encodedProducts));
              }

              if (mpInstance._Store.mpid) {
                self.storeProductsInMemory(decodedProducts, mpInstance._Store.mpid);
              }
            }
          } catch (e) {
            if (mpInstance._Store.isLocalStorageAvailable) {
              localStorage.removeItem(mpInstance._Store.prodStorageName);
            }

            mpInstance._Store.cartProducts = [];
            mpInstance.Logger.error('Error loading products in initialization: ' + e);
          }

          for (var key in allData) {
            if (allData.hasOwnProperty(key)) {
              if (!SDKv2NonMPIDCookieKeys[key]) {
                mpInstance._Store.nonCurrentUserMPIDs[key] = allData[key];
              }
            }
          }

          self.update();
        } catch (e) {
          if (self.useLocalStorage() && mpInstance._Store.isLocalStorageAvailable) {
            localStorage.removeItem(mpInstance._Store.storageName);
          } else {
            self.expireCookies(mpInstance._Store.storageName);
          }

          mpInstance.Logger.error('Error initializing storage: ' + e);
        }
      };

      this.update = function () {
        if (!mpInstance._Store.webviewBridgeEnabled) {
          if (mpInstance._Store.SDKConfig.useCookieStorage) {
            self.setCookie();
          }

          self.setLocalStorage();
        }
      };

      this.storeProductsInMemory = function (products, mpid) {
        if (products) {
          try {
            mpInstance._Store.cartProducts = products[mpid] && products[mpid].cp ? products[mpid].cp : [];
          } catch (e) {
            mpInstance.Logger.error(Messages$5.ErrorMessages.CookieParseError);
          }
        }
      };

      this.storeDataInMemory = function (obj, currentMPID) {
        try {
          if (!obj) {
            mpInstance.Logger.verbose(Messages$5.InformationMessages.CookieNotFound);
            mpInstance._Store.clientId = mpInstance._Store.clientId || mpInstance._Helpers.generateUniqueId();
            mpInstance._Store.deviceId = mpInstance._Store.deviceId || mpInstance._Helpers.generateUniqueId();
          } else {
            // Set MPID first, then change object to match MPID data
            if (currentMPID) {
              mpInstance._Store.mpid = currentMPID;
            } else {
              mpInstance._Store.mpid = obj.cu || 0;
            }

            obj.gs = obj.gs || {};
            mpInstance._Store.sessionId = obj.gs.sid || mpInstance._Store.sessionId;
            mpInstance._Store.isEnabled = typeof obj.gs.ie !== 'undefined' ? obj.gs.ie : mpInstance._Store.isEnabled;
            mpInstance._Store.sessionAttributes = obj.gs.sa || mpInstance._Store.sessionAttributes;
            mpInstance._Store.serverSettings = obj.gs.ss || mpInstance._Store.serverSettings;
            mpInstance._Store.devToken = mpInstance._Store.devToken || obj.gs.dt;
            mpInstance._Store.SDKConfig.appVersion = mpInstance._Store.SDKConfig.appVersion || obj.gs.av;
            mpInstance._Store.clientId = obj.gs.cgid || mpInstance._Store.clientId || mpInstance._Helpers.generateUniqueId();
            mpInstance._Store.deviceId = obj.gs.das || mpInstance._Store.deviceId || mpInstance._Helpers.generateUniqueId();
            mpInstance._Store.integrationAttributes = obj.gs.ia || {};
            mpInstance._Store.context = obj.gs.c || mpInstance._Store.context;
            mpInstance._Store.currentSessionMPIDs = obj.gs.csm || mpInstance._Store.currentSessionMPIDs;
            mpInstance._Store.isLoggedIn = obj.l === true;

            if (obj.gs.les) {
              mpInstance._Store.dateLastEventSent = new Date(obj.gs.les);
            }

            if (obj.gs.ssd) {
              mpInstance._Store.sessionStartDate = new Date(obj.gs.ssd);
            } else {
              mpInstance._Store.sessionStartDate = new Date();
            }

            if (currentMPID) {
              obj = obj[currentMPID];
            } else {
              obj = obj[obj.cu];
            }
          }
        } catch (e) {
          mpInstance.Logger.error(Messages$5.ErrorMessages.CookieParseError);
        }
      };

      this.determineLocalStorageAvailability = function (storage) {
        var result;

        if (window.mParticle && window.mParticle._forceNoLocalStorage) {
          storage = undefined;
        }

        try {
          storage.setItem('mparticle', 'test');
          result = storage.getItem('mparticle') === 'test';
          storage.removeItem('mparticle');
          return result && storage;
        } catch (e) {
          return false;
        }
      };

      this.getUserProductsFromLS = function (mpid) {
        if (!mpInstance._Store.isLocalStorageAvailable) {
          return [];
        }

        var decodedProducts,
            userProducts,
            parsedProducts,
            encodedProducts = localStorage.getItem(mpInstance._Store.prodStorageName);

        if (encodedProducts) {
          decodedProducts = Base64$1.decode(encodedProducts);
        } // if there is an MPID, we are retrieving the user's products, which is an array


        if (mpid) {
          try {
            if (decodedProducts) {
              parsedProducts = JSON.parse(decodedProducts);
            }

            if (decodedProducts && parsedProducts[mpid] && parsedProducts[mpid].cp && Array.isArray(parsedProducts[mpid].cp)) {
              userProducts = parsedProducts[mpid].cp;
            } else {
              userProducts = [];
            }

            return userProducts;
          } catch (e) {
            return [];
          }
        } else {
          return [];
        }
      };

      this.getAllUserProductsFromLS = function () {
        var decodedProducts,
            encodedProducts = localStorage.getItem(mpInstance._Store.prodStorageName),
            parsedDecodedProducts;

        if (encodedProducts) {
          decodedProducts = Base64$1.decode(encodedProducts);
        } // returns an object with keys of MPID and values of array of products


        try {
          parsedDecodedProducts = JSON.parse(decodedProducts);
        } catch (e) {
          parsedDecodedProducts = {};
        }

        return parsedDecodedProducts;
      };

      this.setLocalStorage = function () {
        if (!mpInstance._Store.isLocalStorageAvailable) {
          return;
        }

        var key = mpInstance._Store.storageName,
            allLocalStorageProducts = self.getAllUserProductsFromLS(),
            localStorageData = self.getLocalStorage() || {},
            currentUser = mpInstance.Identity.getCurrentUser(),
            mpid = currentUser ? currentUser.getMPID() : null,
            currentUserProducts = {
          cp: allLocalStorageProducts[mpid] ? allLocalStorageProducts[mpid].cp : []
        };

        if (mpid) {
          allLocalStorageProducts = allLocalStorageProducts || {};
          allLocalStorageProducts[mpid] = currentUserProducts;

          try {
            window.localStorage.setItem(encodeURIComponent(mpInstance._Store.prodStorageName), Base64$1.encode(JSON.stringify(allLocalStorageProducts)));
          } catch (e) {
            mpInstance.Logger.error('Error with setting products on localStorage.');
          }
        }

        if (!mpInstance._Store.SDKConfig.useCookieStorage) {
          localStorageData.gs = localStorageData.gs || {};
          localStorageData.l = mpInstance._Store.isLoggedIn ? 1 : 0;

          if (mpInstance._Store.sessionId) {
            localStorageData.gs.csm = mpInstance._Store.currentSessionMPIDs;
          }

          localStorageData.gs.ie = mpInstance._Store.isEnabled;

          if (mpid) {
            localStorageData.cu = mpid;
          }

          if (Object.keys(mpInstance._Store.nonCurrentUserMPIDs).length) {
            localStorageData = mpInstance._Helpers.extend({}, localStorageData, mpInstance._Store.nonCurrentUserMPIDs);
            mpInstance._Store.nonCurrentUserMPIDs = {};
          }

          localStorageData = setGlobalStorageAttributes(localStorageData);

          try {
            window.localStorage.setItem(encodeURIComponent(key), self.encodePersistence(JSON.stringify(localStorageData)));
          } catch (e) {
            mpInstance.Logger.error('Error with setting localStorage item.');
          }
        }
      };

      function setGlobalStorageAttributes(data) {
        var store = mpInstance._Store;
        data.gs.sid = store.sessionId;
        data.gs.ie = store.isEnabled;
        data.gs.sa = store.sessionAttributes;
        data.gs.ss = store.serverSettings;
        data.gs.dt = store.devToken;
        data.gs.les = store.dateLastEventSent ? store.dateLastEventSent.getTime() : null;
        data.gs.av = store.SDKConfig.appVersion;
        data.gs.cgid = store.clientId;
        data.gs.das = store.deviceId;
        data.gs.c = store.context;
        data.gs.ssd = store.sessionStartDate ? store.sessionStartDate.getTime() : 0;
        data.gs.ia = store.integrationAttributes;
        return data;
      }

      this.getLocalStorage = function () {
        if (!mpInstance._Store.isLocalStorageAvailable) {
          return null;
        }

        var key = mpInstance._Store.storageName,
            localStorageData = self.decodePersistence(window.localStorage.getItem(key)),
            obj = {},
            j;

        if (localStorageData) {
          localStorageData = JSON.parse(localStorageData);

          for (j in localStorageData) {
            if (localStorageData.hasOwnProperty(j)) {
              obj[j] = localStorageData[j];
            }
          }
        }

        if (Object.keys(obj).length) {
          return obj;
        }

        return null;
      };

      function removeLocalStorage(localStorageName) {
        localStorage.removeItem(localStorageName);
      }

      this.expireCookies = function (cookieName) {
        var date = new Date(),
            expires,
            domain,
            cookieDomain;
        cookieDomain = self.getCookieDomain();

        if (cookieDomain === '') {
          domain = '';
        } else {
          domain = ';domain=' + cookieDomain;
        }

        date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
        document.cookie = cookieName + '=' + '' + expires + '; path=/' + domain;
      };

      this.getCookie = function () {
        var cookies = window.document.cookie.split('; '),
            key = mpInstance._Store.storageName,
            i,
            l,
            parts,
            name,
            cookie,
            result = key ? undefined : {};
        mpInstance.Logger.verbose(Messages$5.InformationMessages.CookieSearch);

        for (i = 0, l = cookies.length; i < l; i++) {
          try {
            parts = cookies[i].split('=');
            name = mpInstance._Helpers.decoded(parts.shift());
            cookie = mpInstance._Helpers.decoded(parts.join('='));
          } catch (e) {
            mpInstance.Logger.verbose('Unable to parse cookie: ' + name + '. Skipping.');
          }

          if (key && key === name) {
            result = mpInstance._Helpers.converted(cookie);
            break;
          }

          if (!key) {
            result[name] = mpInstance._Helpers.converted(cookie);
          }
        }

        if (result) {
          mpInstance.Logger.verbose(Messages$5.InformationMessages.CookieFound);
          return JSON.parse(self.decodePersistence(result));
        } else {
          return null;
        }
      }; // only used in persistence


      this.setCookie = function () {
        var mpid,
            currentUser = mpInstance.Identity.getCurrentUser();

        if (currentUser) {
          mpid = currentUser.getMPID();
        }

        var date = new Date(),
            key = mpInstance._Store.storageName,
            cookies = self.getCookie() || {},
            expires = new Date(date.getTime() + mpInstance._Store.SDKConfig.cookieExpiration * 24 * 60 * 60 * 1000).toGMTString(),
            cookieDomain,
            domain,
            encodedCookiesWithExpirationAndPath;
        cookieDomain = self.getCookieDomain();

        if (cookieDomain === '') {
          domain = '';
        } else {
          domain = ';domain=' + cookieDomain;
        }

        cookies.gs = cookies.gs || {};

        if (mpInstance._Store.sessionId) {
          cookies.gs.csm = mpInstance._Store.currentSessionMPIDs;
        }

        if (mpid) {
          cookies.cu = mpid;
        }

        cookies.l = mpInstance._Store.isLoggedIn ? 1 : 0;
        cookies = setGlobalStorageAttributes(cookies);

        if (Object.keys(mpInstance._Store.nonCurrentUserMPIDs).length) {
          cookies = mpInstance._Helpers.extend({}, cookies, mpInstance._Store.nonCurrentUserMPIDs);
          mpInstance._Store.nonCurrentUserMPIDs = {};
        }

        encodedCookiesWithExpirationAndPath = self.reduceAndEncodePersistence(cookies, expires, domain, mpInstance._Store.SDKConfig.maxCookieSize);
        mpInstance.Logger.verbose(Messages$5.InformationMessages.CookieSet);
        window.document.cookie = encodeURIComponent(key) + '=' + encodedCookiesWithExpirationAndPath;
      };
      /*  This function determines if a cookie is greater than the configured maxCookieSize.
          - If it is, we remove an MPID and its associated UI/UA/CSD from the cookie.
          - Once removed, check size, and repeat.
          - Never remove the currentUser's MPID from the cookie.
       MPID removal priority:
      1. If there are no currentSessionMPIDs, remove a random MPID from the the cookie.
      2. If there are currentSessionMPIDs:
          a. Remove at random MPIDs on the cookie that are not part of the currentSessionMPIDs
          b. Then remove MPIDs based on order in currentSessionMPIDs array, which
          stores MPIDs based on earliest login.
      */


      this.reduceAndEncodePersistence = function (persistence, expires, domain, maxCookieSize) {
        var encodedCookiesWithExpirationAndPath,
            currentSessionMPIDs = persistence.gs.csm ? persistence.gs.csm : []; // Comment 1 above

        if (!currentSessionMPIDs.length) {
          for (var key in persistence) {
            if (persistence.hasOwnProperty(key)) {
              encodedCookiesWithExpirationAndPath = createFullEncodedCookie(persistence, expires, domain);

              if (encodedCookiesWithExpirationAndPath.length > maxCookieSize) {
                if (!SDKv2NonMPIDCookieKeys[key] && key !== persistence.cu) {
                  delete persistence[key];
                }
              }
            }
          }
        } else {
          // Comment 2 above - First create an object of all MPIDs on the cookie
          var MPIDsOnCookie = {};

          for (var potentialMPID in persistence) {
            if (persistence.hasOwnProperty(potentialMPID)) {
              if (!SDKv2NonMPIDCookieKeys[potentialMPID] && potentialMPID !== persistence.cu) {
                MPIDsOnCookie[potentialMPID] = 1;
              }
            }
          } // Comment 2a above


          if (Object.keys(MPIDsOnCookie).length) {
            for (var mpid in MPIDsOnCookie) {
              encodedCookiesWithExpirationAndPath = createFullEncodedCookie(persistence, expires, domain);

              if (encodedCookiesWithExpirationAndPath.length > maxCookieSize) {
                if (MPIDsOnCookie.hasOwnProperty(mpid)) {
                  if (currentSessionMPIDs.indexOf(mpid) === -1) {
                    delete persistence[mpid];
                  }
                }
              }
            }
          } // Comment 2b above


          for (var i = 0; i < currentSessionMPIDs.length; i++) {
            encodedCookiesWithExpirationAndPath = createFullEncodedCookie(persistence, expires, domain);

            if (encodedCookiesWithExpirationAndPath.length > maxCookieSize) {
              var MPIDtoRemove = currentSessionMPIDs[i];

              if (persistence[MPIDtoRemove]) {
                mpInstance.Logger.verbose('Size of new encoded cookie is larger than maxCookieSize setting of ' + maxCookieSize + '. Removing from cookie the earliest logged in MPID containing: ' + JSON.stringify(persistence[MPIDtoRemove], 0, 2));
                delete persistence[MPIDtoRemove];
              } else {
                mpInstance.Logger.error('Unable to save MPID data to cookies because the resulting encoded cookie is larger than the maxCookieSize setting of ' + maxCookieSize + '. We recommend using a maxCookieSize of 1500.');
              }
            } else {
              break;
            }
          }
        }

        return encodedCookiesWithExpirationAndPath;
      };

      function createFullEncodedCookie(persistence, expires, domain) {
        return self.encodePersistence(JSON.stringify(persistence)) + ';expires=' + expires + ';path=/' + domain;
      }

      this.findPrevCookiesBasedOnUI = function (identityApiData) {
        var persistence = mpInstance._Persistence.getPersistence();

        var matchedUser;

        if (identityApiData) {
          for (var requestedIdentityType in identityApiData.userIdentities) {
            if (persistence && Object.keys(persistence).length) {
              for (var key in persistence) {
                // any value in persistence that has an MPID key will be an MPID to search through
                // other keys on the cookie are currentSessionMPIDs and currentMPID which should not be searched
                if (persistence[key].mpid) {
                  var cookieUIs = persistence[key].ui;

                  for (var cookieUIType in cookieUIs) {
                    if (requestedIdentityType === cookieUIType && identityApiData.userIdentities[requestedIdentityType] === cookieUIs[cookieUIType]) {
                      matchedUser = key;
                      break;
                    }
                  }
                }
              }
            }
          }
        }

        if (matchedUser) {
          self.storeDataInMemory(persistence, matchedUser);
        }
      };

      this.encodePersistence = function (persistence) {
        persistence = JSON.parse(persistence);

        for (var key in persistence.gs) {
          if (persistence.gs.hasOwnProperty(key)) {
            if (Base64CookieKeys[key]) {
              if (persistence.gs[key]) {
                // base64 encode any value that is an object or Array in globalSettings
                if (Array.isArray(persistence.gs[key]) && persistence.gs[key].length || mpInstance._Helpers.isObject(persistence.gs[key]) && Object.keys(persistence.gs[key]).length) {
                  persistence.gs[key] = Base64$1.encode(JSON.stringify(persistence.gs[key]));
                } else {
                  delete persistence.gs[key];
                }
              } else {
                delete persistence.gs[key];
              }
            } else if (key === 'ie') {
              persistence.gs[key] = persistence.gs[key] ? 1 : 0;
            } else if (!persistence.gs[key]) {
              delete persistence.gs[key];
            }
          }
        }

        for (var mpid in persistence) {
          if (persistence.hasOwnProperty(mpid)) {
            if (!SDKv2NonMPIDCookieKeys[mpid]) {
              for (key in persistence[mpid]) {
                if (persistence[mpid].hasOwnProperty(key)) {
                  if (Base64CookieKeys[key]) {
                    if (mpInstance._Helpers.isObject(persistence[mpid][key]) && Object.keys(persistence[mpid][key]).length) {
                      persistence[mpid][key] = Base64$1.encode(JSON.stringify(persistence[mpid][key]));
                    } else {
                      delete persistence[mpid][key];
                    }
                  }
                }
              }
            }
          }
        }

        return self.createCookieString(JSON.stringify(persistence));
      };

      this.decodePersistence = function (persistence) {
        try {
          if (persistence) {
            persistence = JSON.parse(self.revertCookieString(persistence));

            if (mpInstance._Helpers.isObject(persistence) && Object.keys(persistence).length) {
              for (var key in persistence.gs) {
                if (persistence.gs.hasOwnProperty(key)) {
                  if (Base64CookieKeys[key]) {
                    persistence.gs[key] = JSON.parse(Base64$1.decode(persistence.gs[key]));
                  } else if (key === 'ie') {
                    persistence.gs[key] = Boolean(persistence.gs[key]);
                  }
                }
              }

              for (var mpid in persistence) {
                if (persistence.hasOwnProperty(mpid)) {
                  if (!SDKv2NonMPIDCookieKeys[mpid]) {
                    for (key in persistence[mpid]) {
                      if (persistence[mpid].hasOwnProperty(key)) {
                        if (Base64CookieKeys[key]) {
                          if (persistence[mpid][key].length) {
                            persistence[mpid][key] = JSON.parse(Base64$1.decode(persistence[mpid][key]));
                          }
                        }
                      }
                    }
                  } else if (mpid === 'l') {
                    persistence[mpid] = Boolean(persistence[mpid]);
                  }
                }
              }
            }

            return JSON.stringify(persistence);
          }
        } catch (e) {
          mpInstance.Logger.error('Problem with decoding cookie', e);
        }
      };

      this.replaceCommasWithPipes = function (string) {
        return string.replace(/,/g, '|');
      };

      this.replacePipesWithCommas = function (string) {
        return string.replace(/\|/g, ',');
      };

      this.replaceApostrophesWithQuotes = function (string) {
        return string.replace(/\'/g, '"');
      };

      this.replaceQuotesWithApostrophes = function (string) {
        return string.replace(/\"/g, "'");
      };

      this.createCookieString = function (string) {
        return self.replaceCommasWithPipes(self.replaceQuotesWithApostrophes(string));
      };

      this.revertCookieString = function (string) {
        return self.replacePipesWithCommas(self.replaceApostrophesWithQuotes(string));
      };

      this.getCookieDomain = function () {
        if (mpInstance._Store.SDKConfig.cookieDomain) {
          return mpInstance._Store.SDKConfig.cookieDomain;
        } else {
          var rootDomain = self.getDomain(document, location.hostname);

          if (rootDomain === '') {
            return '';
          } else {
            return '.' + rootDomain;
          }
        }
      }; // This function loops through the parts of a full hostname, attempting to set a cookie on that domain. It will set a cookie at the highest level possible.
      // For example subdomain.domain.co.uk would try the following combinations:
      // "co.uk" -> fail
      // "domain.co.uk" -> success, return
      // "subdomain.domain.co.uk" -> skipped, because already found


      this.getDomain = function (doc, locationHostname) {
        var i,
            testParts,
            mpTest = 'mptest=cookie',
            hostname = locationHostname.split('.');

        for (i = hostname.length - 1; i >= 0; i--) {
          testParts = hostname.slice(i).join('.');
          doc.cookie = mpTest + ';domain=.' + testParts + ';';

          if (doc.cookie.indexOf(mpTest) > -1) {
            doc.cookie = mpTest.split('=')[0] + '=;domain=.' + testParts + ';expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            return testParts;
          }
        }

        return '';
      };

      this.getUserIdentities = function (mpid) {
        var persistence = self.getPersistence();

        if (persistence && persistence[mpid] && persistence[mpid].ui) {
          return persistence[mpid].ui;
        } else {
          return {};
        }
      };

      this.getAllUserAttributes = function (mpid) {
        var persistence = self.getPersistence();

        if (persistence && persistence[mpid] && persistence[mpid].ua) {
          return persistence[mpid].ua;
        } else {
          return {};
        }
      };

      this.getCartProducts = function (mpid) {
        var allCartProducts,
            cartProductsString = localStorage.getItem(mpInstance._Store.prodStorageName);

        if (cartProductsString) {
          allCartProducts = JSON.parse(Base64$1.decode(cartProductsString));

          if (allCartProducts && allCartProducts[mpid] && allCartProducts[mpid].cp) {
            return allCartProducts[mpid].cp;
          }
        }

        return [];
      };

      this.setCartProducts = function (allProducts) {
        if (!mpInstance._Store.isLocalStorageAvailable) {
          return;
        }

        try {
          window.localStorage.setItem(encodeURIComponent(mpInstance._Store.prodStorageName), Base64$1.encode(JSON.stringify(allProducts)));
        } catch (e) {
          mpInstance.Logger.error('Error with setting products on localStorage.');
        }
      };

      this.saveUserIdentitiesToPersistence = function (mpid, userIdentities) {
        if (userIdentities) {
          var persistence = self.getPersistence();

          if (persistence) {
            if (persistence[mpid]) {
              persistence[mpid].ui = userIdentities;
            } else {
              persistence[mpid] = {
                ui: userIdentities
              };
            }

            self.savePersistence(persistence);
          }
        }
      };

      this.saveUserAttributesToPersistence = function (mpid, userAttributes) {
        var persistence = self.getPersistence();

        if (userAttributes) {
          if (persistence) {
            if (persistence[mpid]) {
              persistence[mpid].ui = userAttributes;
            } else {
              persistence[mpid] = {
                ui: userAttributes
              };
            }
          }

          self.savePersistence(persistence);
        }
      };

      this.saveUserCookieSyncDatesToPersistence = function (mpid, csd) {
        if (csd) {
          var persistence = self.getPersistence();

          if (persistence) {
            if (persistence[mpid]) {
              persistence[mpid].csd = csd;
            } else {
              persistence[mpid] = {
                csd: csd
              };
            }
          }

          self.savePersistence(persistence);
        }
      };

      this.saveUserConsentStateToCookies = function (mpid, consentState) {
        //it's currently not supported to set persistence
        //for any MPID that's not the current one.
        if (consentState || consentState === null) {
          var persistence = self.getPersistence();

          if (persistence) {
            if (persistence[mpid]) {
              persistence[mpid].con = mpInstance._Consent.ConsentSerialization.toMinifiedJsonObject(consentState);
            } else {
              persistence[mpid] = {
                con: mpInstance._Consent.ConsentSerialization.toMinifiedJsonObject(consentState)
              };
            }

            self.savePersistence(persistence);
          }
        }
      };

      this.savePersistence = function (persistence) {
        var encodedPersistence = self.encodePersistence(JSON.stringify(persistence)),
            date = new Date(),
            key = mpInstance._Store.storageName,
            expires = new Date(date.getTime() + mpInstance._Store.SDKConfig.cookieExpiration * 24 * 60 * 60 * 1000).toGMTString(),
            cookieDomain = self.getCookieDomain(),
            domain;

        if (cookieDomain === '') {
          domain = '';
        } else {
          domain = ';domain=' + cookieDomain;
        }

        if (mpInstance._Store.SDKConfig.useCookieStorage) {
          var encodedCookiesWithExpirationAndPath = self.reduceAndEncodePersistence(persistence, expires, domain, mpInstance._Store.SDKConfig.maxCookieSize);
          window.document.cookie = encodeURIComponent(key) + '=' + encodedCookiesWithExpirationAndPath;
        } else {
          if (mpInstance._Store.isLocalStorageAvailable) {
            localStorage.setItem(mpInstance._Store.storageName, encodedPersistence);
          }
        }
      };

      this.getPersistence = function () {
        var persistence = this.useLocalStorage() ? this.getLocalStorage() : this.getCookie();
        return persistence;
      };

      this.getConsentState = function (mpid) {
        var persistence = self.getPersistence();

        if (persistence && persistence[mpid] && persistence[mpid].con) {
          return mpInstance._Consent.ConsentSerialization.fromMinifiedJsonObject(persistence[mpid].con);
        } else {
          return null;
        }
      };

      this.getFirstSeenTime = function (mpid) {
        if (!mpid) {
          return null;
        }

        var persistence = self.getPersistence();

        if (persistence && persistence[mpid] && persistence[mpid].fst) {
          return persistence[mpid].fst;
        } else {
          return null;
        }
      };
      /**
       * set the "first seen" time for a user. the time will only be set once for a given
       * mpid after which subsequent calls will be ignored
       */


      this.setFirstSeenTime = function (mpid, time) {
        if (!mpid) {
          return;
        }

        if (!time) {
          time = new Date().getTime();
        }

        var persistence = self.getPersistence();

        if (persistence) {
          if (!persistence[mpid]) {
            persistence[mpid] = {};
          }

          if (!persistence[mpid].fst) {
            persistence[mpid].fst = time;
            self.savePersistence(persistence);
          }
        }
      };
      /**
       * returns the "last seen" time for a user. If the mpid represents the current user, the
       * return value will always be the current time, otherwise it will be to stored "last seen"
       * time
       */


      this.getLastSeenTime = function (mpid) {
        if (!mpid) {
          return null;
        }

        if (mpid === mpInstance.Identity.getCurrentUser().getMPID()) {
          //if the mpid is the current user, its last seen time is the current time
          return new Date().getTime();
        } else {
          var persistence = self.getPersistence();

          if (persistence && persistence[mpid] && persistence[mpid].lst) {
            return persistence[mpid].lst;
          }

          return null;
        }
      };

      this.setLastSeenTime = function (mpid, time) {
        if (!mpid) {
          return;
        }

        if (!time) {
          time = new Date().getTime();
        }

        var persistence = self.getPersistence();

        if (persistence && persistence[mpid]) {
          persistence[mpid].lst = time;
          self.savePersistence(persistence);
        }
      };

      this.getDeviceId = function () {
        return mpInstance._Store.deviceId;
      };

      this.resetPersistence = function () {
        removeLocalStorage(StorageNames$1.localStorageName);
        removeLocalStorage(StorageNames$1.localStorageNameV3);
        removeLocalStorage(StorageNames$1.localStorageNameV4);
        removeLocalStorage(mpInstance._Store.prodStorageName);
        removeLocalStorage(mpInstance._Store.storageName);
        removeLocalStorage(StorageNames$1.localStorageProductsV4);
        self.expireCookies(StorageNames$1.cookieName);
        self.expireCookies(StorageNames$1.cookieNameV2);
        self.expireCookies(StorageNames$1.cookieNameV3);
        self.expireCookies(StorageNames$1.cookieNameV4);
        self.expireCookies(mpInstance._Store.prodStorageName);
        self.expireCookies(mpInstance._Store.storageName);

        if (mParticle._isTestEnv) {
          var testWorkspaceToken = 'abcdef';
          removeLocalStorage(mpInstance._Helpers.createMainStorageName(testWorkspaceToken));
          self.expireCookies(mpInstance._Helpers.createMainStorageName(testWorkspaceToken));
          removeLocalStorage(mpInstance._Helpers.createProductStorageName(testWorkspaceToken));
        }
      }; // Forwarder Batching Code


      this.forwardingStatsBatches = {
        uploadsTable: {},
        forwardingStatsEventQueue: []
      };
    }

    var Messages$6 = Constants.Messages;
    function Events(mpInstance) {
      var self = this;

      this.logEvent = function (event) {
        mpInstance.Logger.verbose(Messages$6.InformationMessages.StartingLogEvent + ': ' + event.name);

        if (mpInstance._Helpers.canLog()) {
          var uploadObject = mpInstance._ServerModel.createEventObject(event);

          mpInstance._APIClient.sendEventToServer(uploadObject);
        } else {
          mpInstance.Logger.verbose(Messages$6.InformationMessages.AbandonLogEvent);
        }
      };

      this.startTracking = function (callback) {
        if (!mpInstance._Store.isTracking) {
          if ('geolocation' in navigator) {
            mpInstance._Store.watchPositionId = navigator.geolocation.watchPosition(successTracking, errorTracking);
          }
        } else {
          var position = {
            coords: {
              latitude: mpInstance._Store.currentPosition.lat,
              longitude: mpInstance._Store.currentPosition.lng
            }
          };
          triggerCallback(callback, position);
        }

        function successTracking(position) {
          mpInstance._Store.currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          triggerCallback(callback, position); // prevents callback from being fired multiple times

          callback = null;
          mpInstance._Store.isTracking = true;
        }

        function errorTracking() {
          triggerCallback(callback); // prevents callback from being fired multiple times

          callback = null;
          mpInstance._Store.isTracking = false;
        }

        function triggerCallback(callback, position) {
          if (callback) {
            try {
              if (position) {
                callback(position);
              } else {
                callback();
              }
            } catch (e) {
              mpInstance.Logger.error('Error invoking the callback passed to startTrackingLocation.');
              mpInstance.Logger.error(e);
            }
          }
        }
      };

      this.stopTracking = function () {
        if (mpInstance._Store.isTracking) {
          navigator.geolocation.clearWatch(mpInstance._Store.watchPositionId);
          mpInstance._Store.currentPosition = null;
          mpInstance._Store.isTracking = false;
        }
      };

      this.logOptOut = function () {
        mpInstance.Logger.verbose(Messages$6.InformationMessages.StartingLogOptOut);

        var event = mpInstance._ServerModel.createEventObject({
          messageType: Types.MessageType.OptOut,
          eventType: Types.EventType.Other
        });

        mpInstance._APIClient.sendEventToServer(event);
      };

      this.logAST = function () {
        self.logEvent({
          messageType: Types.MessageType.AppStateTransition
        });
      };

      this.logCheckoutEvent = function (step, option, attrs, customFlags) {
        var event = mpInstance._Ecommerce.createCommerceEventObject(customFlags);

        if (event) {
          event.EventName += mpInstance._Ecommerce.getProductActionEventName(Types.ProductActionType.Checkout);
          event.EventCategory = Types.CommerceEventType.ProductCheckout;
          event.ProductAction = {
            ProductActionType: Types.ProductActionType.Checkout,
            CheckoutStep: step,
            CheckoutOptions: option,
            ProductList: []
          };
          self.logCommerceEvent(event, attrs);
        }
      };

      this.logProductActionEvent = function (productActionType, product, customAttrs, customFlags, transactionAttributes) {
        var event = mpInstance._Ecommerce.createCommerceEventObject(customFlags);

        var productList = Array.isArray(product) ? product : [product];
        productList.forEach(function (product) {
          if (product.TotalAmount) {
            product.TotalAmount = mpInstance._Ecommerce.sanitizeAmount(product.TotalAmount, 'TotalAmount');
          }

          if (product.Position) {
            product.Position = mpInstance._Ecommerce.sanitizeAmount(product.Position, 'Position');
          }

          if (product.Price) {
            product.Price = mpInstance._Ecommerce.sanitizeAmount(product.Price, 'Price');
          }

          if (product.Quantity) {
            product.Quantity = mpInstance._Ecommerce.sanitizeAmount(product.Quantity, 'Quantity');
          }
        });

        if (event) {
          event.EventCategory = mpInstance._Ecommerce.convertProductActionToEventType(productActionType);
          event.EventName += mpInstance._Ecommerce.getProductActionEventName(productActionType);
          event.ProductAction = {
            ProductActionType: productActionType,
            ProductList: productList
          };

          if (mpInstance._Helpers.isObject(transactionAttributes)) {
            mpInstance._Ecommerce.convertTransactionAttributesToProductAction(transactionAttributes, event.ProductAction);
          }

          self.logCommerceEvent(event, customAttrs);
        }
      };

      this.logPurchaseEvent = function (transactionAttributes, product, attrs, customFlags) {
        var event = mpInstance._Ecommerce.createCommerceEventObject(customFlags);

        if (event) {
          event.EventName += mpInstance._Ecommerce.getProductActionEventName(Types.ProductActionType.Purchase);
          event.EventCategory = Types.CommerceEventType.ProductPurchase;
          event.ProductAction = {
            ProductActionType: Types.ProductActionType.Purchase
          };
          event.ProductAction.ProductList = mpInstance._Ecommerce.buildProductList(event, product);

          mpInstance._Ecommerce.convertTransactionAttributesToProductAction(transactionAttributes, event.ProductAction);

          self.logCommerceEvent(event, attrs);
        }
      };

      this.logRefundEvent = function (transactionAttributes, product, attrs, customFlags) {
        if (!transactionAttributes) {
          mpInstance.Logger.error(Messages$6.ErrorMessages.TransactionRequired);
          return;
        }

        var event = mpInstance._Ecommerce.createCommerceEventObject(customFlags);

        if (event) {
          event.EventName += mpInstance._Ecommerce.getProductActionEventName(Types.ProductActionType.Refund);
          event.EventCategory = Types.CommerceEventType.ProductRefund;
          event.ProductAction = {
            ProductActionType: Types.ProductActionType.Refund
          };
          event.ProductAction.ProductList = mpInstance._Ecommerce.buildProductList(event, product);

          mpInstance._Ecommerce.convertTransactionAttributesToProductAction(transactionAttributes, event.ProductAction);

          self.logCommerceEvent(event, attrs);
        }
      };

      this.logPromotionEvent = function (promotionType, promotion, attrs, customFlags) {
        var event = mpInstance._Ecommerce.createCommerceEventObject(customFlags);

        if (event) {
          event.EventName += mpInstance._Ecommerce.getPromotionActionEventName(promotionType);
          event.EventCategory = mpInstance._Ecommerce.convertPromotionActionToEventType(promotionType);
          event.PromotionAction = {
            PromotionActionType: promotionType,
            PromotionList: [promotion]
          };
          self.logCommerceEvent(event, attrs);
        }
      };

      this.logImpressionEvent = function (impression, attrs, customFlags) {
        var event = mpInstance._Ecommerce.createCommerceEventObject(customFlags);

        if (event) {
          event.EventName += 'Impression';
          event.EventCategory = Types.CommerceEventType.ProductImpression;

          if (!Array.isArray(impression)) {
            impression = [impression];
          }

          event.ProductImpressions = [];
          impression.forEach(function (impression) {
            event.ProductImpressions.push({
              ProductImpressionList: impression.Name,
              ProductList: Array.isArray(impression.Product) ? impression.Product : [impression.Product]
            });
          });
          self.logCommerceEvent(event, attrs);
        }
      };

      this.logCommerceEvent = function (commerceEvent, attrs) {
        mpInstance.Logger.verbose(Messages$6.InformationMessages.StartingLogCommerceEvent);
        attrs = mpInstance._Helpers.sanitizeAttributes(attrs, commerceEvent.EventName);

        if (mpInstance._Helpers.canLog()) {
          if (mpInstance._Store.webviewBridgeEnabled) {
            // Don't send shopping cart to parent sdks
            commerceEvent.ShoppingCart = {};
          }

          if (attrs) {
            commerceEvent.EventAttributes = attrs;
          }

          mpInstance._APIClient.sendEventToServer(commerceEvent);

          mpInstance._Persistence.update();
        } else {
          mpInstance.Logger.verbose(Messages$6.InformationMessages.AbandonLogEvent);
        }
      };

      this.addEventHandler = function (domEvent, selector, eventName, data, eventType) {
        var elements = [],
            handler = function handler(e) {
          var timeoutHandler = function timeoutHandler() {
            if (element.href) {
              window.location.href = element.href;
            } else if (element.submit) {
              element.submit();
            }
          };

          mpInstance.Logger.verbose('DOM event triggered, handling event');
          self.logEvent({
            messageType: Types.MessageType.PageEvent,
            name: typeof eventName === 'function' ? eventName(element) : eventName,
            data: typeof data === 'function' ? data(element) : data,
            eventType: eventType || Types.EventType.Other
          }); // TODO: Handle middle-clicks and special keys (ctrl, alt, etc)

          if (element.href && element.target !== '_blank' || element.submit) {
            // Give xmlhttprequest enough time to execute before navigating a link or submitting form
            if (e.preventDefault) {
              e.preventDefault();
            } else {
              e.returnValue = false;
            }

            setTimeout(timeoutHandler, mpInstance._Store.SDKConfig.timeout);
          }
        },
            element,
            i;

        if (!selector) {
          mpInstance.Logger.error("Can't bind event, selector is required");
          return;
        } // Handle a css selector string or a dom element


        if (typeof selector === 'string') {
          elements = document.querySelectorAll(selector);
        } else if (selector.nodeType) {
          elements = [selector];
        }

        if (elements.length) {
          mpInstance.Logger.verbose('Found ' + elements.length + ' element' + (elements.length > 1 ? 's' : '') + ', attaching event handlers');

          for (i = 0; i < elements.length; i++) {
            element = elements[i];

            if (element.addEventListener) {
              element.addEventListener(domEvent, handler, false);
            } else if (element.attachEvent) {
              element.attachEvent('on' + domEvent, handler);
            } else {
              element['on' + domEvent] = handler;
            }
          }
        } else {
          mpInstance.Logger.verbose('No elements found');
        }
      };
    }

    var StorageNames$2 = Constants.StorageNames,
        Base64$2 = Polyfill.Base64,
        CookiesGlobalSettingsKeys = {
      das: 1
    },
        MPIDKeys = {
      ui: 1
    };
    function Migrations(mpInstance) {
      var self = this; //  if there is a cookie or localStorage:
      //  1. determine which version it is ('mprtcl-api', 'mprtcl-v2', 'mprtcl-v3', 'mprtcl-v4')
      //  2. return if 'mprtcl-v4', otherwise migrate to mprtclv4 schema
      // 3. if 'mprtcl-api', could be JSSDKv2 or JSSDKv1. JSSDKv2 cookie has a 'globalSettings' key on it

      this.migrate = function () {
        try {
          migrateCookies();
        } catch (e) {
          mpInstance._Persistence.expireCookies(StorageNames$2.cookieNameV3);

          mpInstance._Persistence.expireCookies(StorageNames$2.cookieNameV4);

          mpInstance.Logger.error('Error migrating cookie: ' + e);
        }

        if (mpInstance._Store.isLocalStorageAvailable) {
          try {
            migrateLocalStorage();
          } catch (e) {
            localStorage.removeItem(StorageNames$2.localStorageNameV3);
            localStorage.removeItem(StorageNames$2.localStorageNameV4);
            mpInstance.Logger.error('Error migrating localStorage: ' + e);
          }
        }
      };

      function migrateCookies() {
        var cookies = window.document.cookie.split('; '),
            foundCookie,
            i,
            l,
            parts,
            name,
            cookie;
        mpInstance.Logger.verbose(Constants.Messages.InformationMessages.CookieSearch);

        for (i = 0, l = cookies.length; i < l; i++) {
          try {
            parts = cookies[i].split('=');
            name = mpInstance._Helpers.decoded(parts.shift());
            cookie = mpInstance._Helpers.decoded(parts.join('='));
          } catch (e) {
            mpInstance.Logger.verbose('Unable to parse cookie: ' + name + '. Skipping.');
          } //most recent version needs no migration


          if (name === mpInstance._Store.storageName) {
            return;
          }

          if (name === StorageNames$2.cookieNameV4) {
            // adds cookies to new namespace, removes previous cookie
            finishCookieMigration(cookie, StorageNames$2.cookieNameV4);

            if (mpInstance._Store.isLocalStorageAvailable) {
              migrateProductsToNameSpace();
            }

            return; // migration path for SDKv1CookiesV3, doesn't need to be encoded
          }

          if (name === StorageNames$2.cookieNameV3) {
            foundCookie = self.convertSDKv1CookiesV3ToSDKv2CookiesV4(cookie);
            finishCookieMigration(foundCookie, StorageNames$2.cookieNameV3);
            break;
          }
        }
      }

      function finishCookieMigration(cookie, cookieName) {
        var date = new Date(),
            cookieDomain = mpInstance._Persistence.getCookieDomain(),
            expires,
            domain;

        expires = new Date(date.getTime() + StorageNames$2.CookieExpiration * 24 * 60 * 60 * 1000).toGMTString();

        if (cookieDomain === '') {
          domain = '';
        } else {
          domain = ';domain=' + cookieDomain;
        }

        mpInstance.Logger.verbose(Constants.Messages.InformationMessages.CookieSet);
        window.document.cookie = encodeURIComponent(mpInstance._Store.storageName) + '=' + cookie + ';expires=' + expires + ';path=/' + domain;

        mpInstance._Persistence.expireCookies(cookieName);

        mpInstance._Store.migratingToIDSyncCookies = true;
      }

      this.convertSDKv1CookiesV3ToSDKv2CookiesV4 = function (SDKv1CookiesV3) {
        SDKv1CookiesV3 = mpInstance._Persistence.replacePipesWithCommas(mpInstance._Persistence.replaceApostrophesWithQuotes(SDKv1CookiesV3));
        var parsedSDKv1CookiesV3 = JSON.parse(SDKv1CookiesV3);
        var parsedCookiesV4 = JSON.parse(restructureToV4Cookie(SDKv1CookiesV3));

        if (parsedSDKv1CookiesV3.mpid) {
          parsedCookiesV4.gs.csm.push(parsedSDKv1CookiesV3.mpid); // all other values are already encoded, so we have to encode any new values

          parsedCookiesV4.gs.csm = Base64$2.encode(JSON.stringify(parsedCookiesV4.gs.csm));
          migrateProductsFromSDKv1ToSDKv2CookiesV4(parsedSDKv1CookiesV3, parsedSDKv1CookiesV3.mpid);
        }

        return JSON.stringify(parsedCookiesV4);
      };

      function restructureToV4Cookie(cookies) {
        try {
          var cookiesV4Schema = {
            gs: {
              csm: []
            }
          };
          cookies = JSON.parse(cookies);

          for (var key in cookies) {
            if (cookies.hasOwnProperty(key)) {
              if (CookiesGlobalSettingsKeys[key]) {
                cookiesV4Schema.gs[key] = cookies[key];
              } else if (key === 'mpid') {
                cookiesV4Schema.cu = cookies[key];
              } else if (cookies.mpid) {
                cookiesV4Schema[cookies.mpid] = cookiesV4Schema[cookies.mpid] || {};

                if (MPIDKeys[key]) {
                  cookiesV4Schema[cookies.mpid][key] = cookies[key];
                }
              }
            }
          }

          return JSON.stringify(cookiesV4Schema);
        } catch (e) {
          mpInstance.Logger.error('Failed to restructure previous cookie into most current cookie schema');
        }
      }

      function migrateProductsToNameSpace() {
        var lsProdV4Name = StorageNames$2.localStorageProductsV4;
        var products = localStorage.getItem(StorageNames$2.localStorageProductsV4);
        localStorage.setItem(mpInstance._Store.prodStorageName, products);
        localStorage.removeItem(lsProdV4Name);
      }

      function migrateProductsFromSDKv1ToSDKv2CookiesV4(cookies, mpid) {
        if (!mpInstance._Store.isLocalStorageAvailable) {
          return;
        }

        var localStorageProducts = {};
        localStorageProducts[mpid] = {};

        if (cookies.cp) {
          try {
            localStorageProducts[mpid].cp = JSON.parse(Base64$2.decode(cookies.cp));
          } catch (e) {
            localStorageProducts[mpid].cp = cookies.cp;
          }

          if (!Array.isArray(localStorageProducts[mpid].cp)) {
            localStorageProducts[mpid].cp = [];
          }
        }

        localStorage.setItem(mpInstance._Store.prodStorageName, Base64$2.encode(JSON.stringify(localStorageProducts)));
      }

      function migrateLocalStorage() {
        var cookies,
            v3LSName = StorageNames$2.localStorageNameV3,
            v4LSName = StorageNames$2.localStorageNameV4,
            currentVersionLSData = window.localStorage.getItem(mpInstance._Store.storageName),
            v4LSData,
            v3LSData,
            v3LSDataStringCopy;

        if (currentVersionLSData) {
          return;
        }

        v4LSData = window.localStorage.getItem(v4LSName);

        if (v4LSData) {
          finishLSMigration(v4LSData, v4LSName);
          migrateProductsToNameSpace();
          return;
        }

        v3LSData = window.localStorage.getItem(v3LSName);

        if (v3LSData) {
          mpInstance._Store.migratingToIDSyncCookies = true;
          v3LSDataStringCopy = v3LSData.slice();
          v3LSData = JSON.parse(mpInstance._Persistence.replacePipesWithCommas(mpInstance._Persistence.replaceApostrophesWithQuotes(v3LSData))); // localStorage may contain only products, or the full persistence
          // when there is an MPID on the cookie, it is the full persistence

          if (v3LSData.mpid) {
            v3LSData = JSON.parse(self.convertSDKv1CookiesV3ToSDKv2CookiesV4(v3LSDataStringCopy));
            finishLSMigration(JSON.stringify(v3LSData), v3LSName);
            return; // if no MPID, it is only the products
          } else if ((v3LSData.cp || v3LSData.pb) && !v3LSData.mpid) {
            cookies = mpInstance._Persistence.getCookie();

            if (cookies) {
              migrateProductsFromSDKv1ToSDKv2CookiesV4(v3LSData, cookies.cu);
              localStorage.removeItem(StorageNames$2.localStorageNameV3);
              return;
            } else {
              localStorage.removeItem(StorageNames$2.localStorageNameV3);
              return;
            }
          }
        }

        function finishLSMigration(data, lsName) {
          try {
            window.localStorage.setItem(encodeURIComponent(mpInstance._Store.storageName), data);
          } catch (e) {
            mpInstance.Logger.error('Error with setting localStorage item.');
          }

          window.localStorage.removeItem(encodeURIComponent(lsName));
        }
      }
    }

    function filteredMparticleUser(mpid, forwarder, mpInstance, kitBlocker) {
      var self = this;
      return {
        getUserIdentities: function getUserIdentities() {
          var currentUserIdentities = {};

          var identities = mpInstance._Persistence.getUserIdentities(mpid);

          for (var identityType in identities) {
            if (identities.hasOwnProperty(identityType)) {
              var identityName = Types.IdentityType.getIdentityName(mpInstance._Helpers.parseNumber(identityType));
              if (!kitBlocker || kitBlocker && !kitBlocker.isIdentityBlocked(identityName)) //if identity type is not blocked
                currentUserIdentities[identityName] = identities[identityType];
            }
          }

          currentUserIdentities = mpInstance._Helpers.filterUserIdentitiesForForwarders(currentUserIdentities, forwarder.userIdentityFilters);
          return {
            userIdentities: currentUserIdentities
          };
        },
        getMPID: function getMPID() {
          return mpid;
        },
        getUserAttributesLists: function getUserAttributesLists(forwarder) {
          var userAttributes,
              userAttributesLists = {};
          userAttributes = self.getAllUserAttributes();

          for (var key in userAttributes) {
            if (userAttributes.hasOwnProperty(key) && Array.isArray(userAttributes[key])) {
              if (!kitBlocker || kitBlocker && !kitBlocker.isAttributeKeyBlocked(key)) {
                userAttributesLists[key] = userAttributes[key].slice();
              }
            }
          }

          userAttributesLists = mpInstance._Helpers.filterUserAttributes(userAttributesLists, forwarder.userAttributeFilters);
          return userAttributesLists;
        },
        getAllUserAttributes: function getAllUserAttributes() {
          var userAttributesCopy = {};

          var userAttributes = mpInstance._Persistence.getAllUserAttributes(mpid);

          if (userAttributes) {
            for (var prop in userAttributes) {
              if (userAttributes.hasOwnProperty(prop)) {
                if (!kitBlocker || kitBlocker && !kitBlocker.isAttributeKeyBlocked(prop)) {
                  if (Array.isArray(userAttributes[prop])) {
                    userAttributesCopy[prop] = userAttributes[prop].slice();
                  } else {
                    userAttributesCopy[prop] = userAttributes[prop];
                  }
                }
              }
            }
          }

          userAttributesCopy = mpInstance._Helpers.filterUserAttributes(userAttributesCopy, forwarder.userAttributeFilters);
          return userAttributesCopy;
        }
      };
    }

    function Forwarders(mpInstance, kitBlocker) {
      var self = this;

      this.initForwarders = function (userIdentities, forwardingStatsCallback) {
        var user = mpInstance.Identity.getCurrentUser();

        if (!mpInstance._Store.webviewBridgeEnabled && mpInstance._Store.configuredForwarders) {
          // Some js libraries require that they be loaded first, or last, etc
          mpInstance._Store.configuredForwarders.sort(function (x, y) {
            x.settings.PriorityValue = x.settings.PriorityValue || 0;
            y.settings.PriorityValue = y.settings.PriorityValue || 0;
            return -1 * (x.settings.PriorityValue - y.settings.PriorityValue);
          });

          mpInstance._Store.activeForwarders = mpInstance._Store.configuredForwarders.filter(function (forwarder) {
            if (!mpInstance._Consent.isEnabledForUserConsent(forwarder.filteringConsentRuleValues, user)) {
              return false;
            }

            if (!self.isEnabledForUserAttributes(forwarder.filteringUserAttributeValue, user)) {
              return false;
            }

            if (!self.isEnabledForUnknownUser(forwarder.excludeAnonymousUser, user)) {
              return false;
            }

            var filteredUserIdentities = mpInstance._Helpers.filterUserIdentities(userIdentities, forwarder.userIdentityFilters);

            var filteredUserAttributes = mpInstance._Helpers.filterUserAttributes(user ? user.getAllUserAttributes() : {}, forwarder.userAttributeFilters);

            if (!forwarder.initialized) {
              forwarder.init(forwarder.settings, forwardingStatsCallback, false, null, filteredUserAttributes, filteredUserIdentities, mpInstance._Store.SDKConfig.appVersion, mpInstance._Store.SDKConfig.appName, mpInstance._Store.SDKConfig.customFlags, mpInstance._Store.clientId);
              forwarder.initialized = true;
            }

            return true;
          });
        }
      };

      this.isEnabledForUserAttributes = function (filterObject, user) {
        if (!filterObject || !mpInstance._Helpers.isObject(filterObject) || !Object.keys(filterObject).length) {
          return true;
        }

        var attrHash, valueHash, userAttributes;

        if (!user) {
          return false;
        } else {
          userAttributes = user.getAllUserAttributes();
        }

        var isMatch = false;

        try {
          if (userAttributes && mpInstance._Helpers.isObject(userAttributes) && Object.keys(userAttributes).length) {
            for (var attrName in userAttributes) {
              if (userAttributes.hasOwnProperty(attrName)) {
                attrHash = mpInstance._Helpers.generateHash(attrName).toString();
                valueHash = mpInstance._Helpers.generateHash(userAttributes[attrName]).toString();

                if (attrHash === filterObject.userAttributeName && valueHash === filterObject.userAttributeValue) {
                  isMatch = true;
                  break;
                }
              }
            }
          }

          if (filterObject) {
            return filterObject.includeOnMatch === isMatch;
          } else {
            return true;
          }
        } catch (e) {
          // in any error scenario, err on side of returning true and forwarding event
          return true;
        }
      };

      this.isEnabledForUnknownUser = function (excludeAnonymousUserBoolean, user) {
        if (!user || !user.isLoggedIn()) {
          if (excludeAnonymousUserBoolean) {
            return false;
          }
        }

        return true;
      };

      this.applyToForwarders = function (functionName, functionArgs) {
        if (mpInstance._Store.activeForwarders.length) {
          mpInstance._Store.activeForwarders.forEach(function (forwarder) {
            var forwarderFunction = forwarder[functionName];

            if (forwarderFunction) {
              try {
                var result = forwarder[functionName](functionArgs);

                if (result) {
                  mpInstance.Logger.verbose(result);
                }
              } catch (e) {
                mpInstance.Logger.verbose(e);
              }
            }
          });
        }
      };

      this.sendEventToForwarders = function (event) {
        var clonedEvent,
            hashedEventName,
            hashedEventType,
            filterUserIdentities = function filterUserIdentities(event, filterList) {
          if (event.UserIdentities && event.UserIdentities.length) {
            event.UserIdentities.forEach(function (userIdentity, i) {
              if (mpInstance._Helpers.inArray(filterList, userIdentity.Type)) {
                event.UserIdentities.splice(i, 1);

                if (i > 0) {
                  i--;
                }
              }
            });
          }
        },
            filterAttributes = function filterAttributes(event, filterList) {
          var hash;

          if (!filterList) {
            return;
          }

          for (var attrName in event.EventAttributes) {
            if (event.EventAttributes.hasOwnProperty(attrName)) {
              hash = mpInstance._Helpers.generateHash(event.EventCategory + event.EventName + attrName);

              if (mpInstance._Helpers.inArray(filterList, hash)) {
                delete event.EventAttributes[attrName];
              }
            }
          }
        },
            inFilteredList = function inFilteredList(filterList, hash) {
          if (filterList && filterList.length) {
            if (mpInstance._Helpers.inArray(filterList, hash)) {
              return true;
            }
          }

          return false;
        },
            forwardingRuleMessageTypes = [Types.MessageType.PageEvent, Types.MessageType.PageView, Types.MessageType.Commerce];

        if (!mpInstance._Store.webviewBridgeEnabled && mpInstance._Store.activeForwarders) {
          hashedEventName = mpInstance._Helpers.generateHash(event.EventCategory + event.EventName);
          hashedEventType = mpInstance._Helpers.generateHash(event.EventCategory);

          for (var i = 0; i < mpInstance._Store.activeForwarders.length; i++) {
            // Check attribute forwarding rule. This rule allows users to only forward an event if a
            // specific attribute exists and has a specific value. Alternatively, they can specify
            // that an event not be forwarded if the specified attribute name and value exists.
            // The two cases are controlled by the "includeOnMatch" boolean value.
            // Supported message types for attribute forwarding rules are defined in the forwardingRuleMessageTypes array
            if (forwardingRuleMessageTypes.indexOf(event.EventDataType) > -1 && mpInstance._Store.activeForwarders[i].filteringEventAttributeValue && mpInstance._Store.activeForwarders[i].filteringEventAttributeValue.eventAttributeName && mpInstance._Store.activeForwarders[i].filteringEventAttributeValue.eventAttributeValue) {
              var foundProp = null; // Attempt to find the attribute in the collection of event attributes

              if (event.EventAttributes) {
                for (var prop in event.EventAttributes) {
                  var hashedEventAttributeName;
                  hashedEventAttributeName = mpInstance._Helpers.generateHash(prop).toString();

                  if (hashedEventAttributeName === mpInstance._Store.activeForwarders[i].filteringEventAttributeValue.eventAttributeName) {
                    foundProp = {
                      name: hashedEventAttributeName,
                      value: mpInstance._Helpers.generateHash(event.EventAttributes[prop]).toString()
                    };
                  }

                  if (foundProp) {
                    break;
                  }
                }
              }

              var isMatch = foundProp !== null && foundProp.value === mpInstance._Store.activeForwarders[i].filteringEventAttributeValue.eventAttributeValue;
              var shouldInclude = mpInstance._Store.activeForwarders[i].filteringEventAttributeValue.includeOnMatch === true ? isMatch : !isMatch;

              if (!shouldInclude) {
                continue;
              }
            } // Clone the event object, as we could be sending different attributes to each forwarder


            clonedEvent = {};
            clonedEvent = mpInstance._Helpers.extend(true, clonedEvent, event); // Check event filtering rules

            if (event.EventDataType === Types.MessageType.PageEvent && (inFilteredList(mpInstance._Store.activeForwarders[i].eventNameFilters, hashedEventName) || inFilteredList(mpInstance._Store.activeForwarders[i].eventTypeFilters, hashedEventType))) {
              continue;
            } else if (event.EventDataType === Types.MessageType.Commerce && inFilteredList(mpInstance._Store.activeForwarders[i].eventTypeFilters, hashedEventType)) {
              continue;
            } else if (event.EventDataType === Types.MessageType.PageView && inFilteredList(mpInstance._Store.activeForwarders[i].screenNameFilters, hashedEventName)) {
              continue;
            } // Check attribute filtering rules


            if (clonedEvent.EventAttributes) {
              if (event.EventDataType === Types.MessageType.PageEvent) {
                filterAttributes(clonedEvent, mpInstance._Store.activeForwarders[i].attributeFilters);
              } else if (event.EventDataType === Types.MessageType.PageView) {
                filterAttributes(clonedEvent, mpInstance._Store.activeForwarders[i].screenAttributeFilters);
              }
            } // Check user identity filtering rules


            filterUserIdentities(clonedEvent, mpInstance._Store.activeForwarders[i].userIdentityFilters); // Check user attribute filtering rules

            clonedEvent.UserAttributes = mpInstance._Helpers.filterUserAttributes(clonedEvent.UserAttributes, mpInstance._Store.activeForwarders[i].userAttributeFilters);
            mpInstance.Logger.verbose('Sending message to forwarder: ' + mpInstance._Store.activeForwarders[i].name);

            if (mpInstance._Store.activeForwarders[i].process) {
              var result = mpInstance._Store.activeForwarders[i].process(clonedEvent);

              if (result) {
                mpInstance.Logger.verbose(result);
              }
            }
          }
        }
      };

      this.callSetUserAttributeOnForwarders = function (key, value) {
        if (kitBlocker && kitBlocker.isAttributeKeyBlocked(key)) {
          return;
        }

        if (mpInstance._Store.activeForwarders.length) {
          mpInstance._Store.activeForwarders.forEach(function (forwarder) {
            if (forwarder.setUserAttribute && forwarder.userAttributeFilters && !mpInstance._Helpers.inArray(forwarder.userAttributeFilters, mpInstance._Helpers.generateHash(key))) {
              try {
                var result = forwarder.setUserAttribute(key, value);

                if (result) {
                  mpInstance.Logger.verbose(result);
                }
              } catch (e) {
                mpInstance.Logger.error(e);
              }
            }
          });
        }
      };

      this.setForwarderUserIdentities = function (userIdentities) {
        mpInstance._Store.activeForwarders.forEach(function (forwarder) {
          var filteredUserIdentities = mpInstance._Helpers.filterUserIdentities(userIdentities, forwarder.userIdentityFilters);

          if (forwarder.setUserIdentity) {
            filteredUserIdentities.forEach(function (identity) {
              var result = forwarder.setUserIdentity(identity.Identity, identity.Type);

              if (result) {
                mpInstance.Logger.verbose(result);
              }
            });
          }
        });
      };

      this.setForwarderOnUserIdentified = function (user) {
        mpInstance._Store.activeForwarders.forEach(function (forwarder) {
          var filteredUser = filteredMparticleUser(user.getMPID(), forwarder, mpInstance, kitBlocker);

          if (forwarder.onUserIdentified) {
            var result = forwarder.onUserIdentified(filteredUser);

            if (result) {
              mpInstance.Logger.verbose(result);
            }
          }
        });
      };

      this.setForwarderOnIdentityComplete = function (user, identityMethod) {
        var result;

        mpInstance._Store.activeForwarders.forEach(function (forwarder) {
          var filteredUser = filteredMparticleUser(user.getMPID(), forwarder, mpInstance, kitBlocker);

          if (identityMethod === 'identify') {
            if (forwarder.onIdentifyComplete) {
              result = forwarder.onIdentifyComplete(filteredUser);

              if (result) {
                mpInstance.Logger.verbose(result);
              }
            }
          } else if (identityMethod === 'login') {
            if (forwarder.onLoginComplete) {
              result = forwarder.onLoginComplete(filteredUser);

              if (result) {
                mpInstance.Logger.verbose(result);
              }
            }
          } else if (identityMethod === 'logout') {
            if (forwarder.onLogoutComplete) {
              result = forwarder.onLogoutComplete(filteredUser);

              if (result) {
                mpInstance.Logger.verbose(result);
              }
            }
          } else if (identityMethod === 'modify') {
            if (forwarder.onModifyComplete) {
              result = forwarder.onModifyComplete(filteredUser);

              if (result) {
                mpInstance.Logger.verbose(result);
              }
            }
          }
        });
      };

      this.getForwarderStatsQueue = function () {
        return mpInstance._Persistence.forwardingStatsBatches.forwardingStatsEventQueue;
      };

      this.setForwarderStatsQueue = function (queue) {
        mpInstance._Persistence.forwardingStatsBatches.forwardingStatsEventQueue = queue;
      };

      this.configureForwarder = function (configuration) {
        var newForwarder = null,
            config = configuration,
            forwarders = {}; // if there are kits inside of mpInstance._Store.SDKConfig.kits, then mParticle is self hosted

        if (mpInstance._Helpers.isObject(mpInstance._Store.SDKConfig.kits) && Object.keys(mpInstance._Store.SDKConfig.kits).length > 0) {
          forwarders = mpInstance._Store.SDKConfig.kits; // otherwise mParticle is loaded via script tag
        } else if (mpInstance._preInit.forwarderConstructors.length > 0) {
          mpInstance._preInit.forwarderConstructors.forEach(function (forwarder) {
            forwarders[forwarder.name] = forwarder;
          });
        }

        for (var name in forwarders) {
          if (name === config.name) {
            if (config.isDebug === mpInstance._Store.SDKConfig.isDevelopmentMode || config.isSandbox === mpInstance._Store.SDKConfig.isDevelopmentMode) {
              newForwarder = new forwarders[name].constructor();
              newForwarder.id = config.moduleId;
              newForwarder.isSandbox = config.isDebug || config.isSandbox;
              newForwarder.hasSandbox = config.hasDebugString === 'true';
              newForwarder.isVisible = config.isVisible;
              newForwarder.settings = config.settings;
              newForwarder.eventNameFilters = config.eventNameFilters;
              newForwarder.eventTypeFilters = config.eventTypeFilters;
              newForwarder.attributeFilters = config.attributeFilters;
              newForwarder.screenNameFilters = config.screenNameFilters;
              newForwarder.screenNameFilters = config.screenNameFilters;
              newForwarder.screenAttributeFilters = config.screenAttributeFilters;
              newForwarder.userIdentityFilters = config.userIdentityFilters;
              newForwarder.userAttributeFilters = config.userAttributeFilters;
              newForwarder.filteringEventAttributeValue = config.filteringEventAttributeValue;
              newForwarder.filteringUserAttributeValue = config.filteringUserAttributeValue;
              newForwarder.eventSubscriptionId = config.eventSubscriptionId;
              newForwarder.filteringConsentRuleValues = config.filteringConsentRuleValues;
              newForwarder.excludeAnonymousUser = config.excludeAnonymousUser;

              mpInstance._Store.configuredForwarders.push(newForwarder);

              break;
            }
          }
        }
      };

      this.configurePixel = function (settings) {
        if (settings.isDebug === mpInstance._Store.SDKConfig.isDevelopmentMode || settings.isProduction !== mpInstance._Store.SDKConfig.isDevelopmentMode) {
          mpInstance._Store.pixelConfigurations.push(settings);
        }
      };

      this.processForwarders = function (config, forwardingStatsCallback) {
        if (!config) {
          mpInstance.Logger.warning('No config was passed. Cannot process forwarders');
        } else {
          try {
            if (Array.isArray(config.kitConfigs) && config.kitConfigs.length) {
              config.kitConfigs.forEach(function (kitConfig) {
                self.configureForwarder(kitConfig);
              });
            }

            if (Array.isArray(config.pixelConfigs) && config.pixelConfigs.length) {
              config.pixelConfigs.forEach(function (pixelConfig) {
                self.configurePixel(pixelConfig);
              });
            }

            self.initForwarders(mpInstance._Store.SDKConfig.identifyRequest.userIdentities, forwardingStatsCallback);
          } catch (e) {
            mpInstance.Logger.error('Config was not parsed propertly. Forwarders may not be initialized.');
          }
        }
      };
    }

    var MessageType$1 = Types.MessageType,
        ApplicationTransitionType$1 = Types.ApplicationTransitionType;
    function ServerModel(mpInstance) {
      var self = this;

      function convertCustomFlags(event, dto) {
        var valueArray = [];
        dto.flags = {};

        for (var prop in event.CustomFlags) {
          valueArray = [];

          if (event.CustomFlags.hasOwnProperty(prop)) {
            if (Array.isArray(event.CustomFlags[prop])) {
              event.CustomFlags[prop].forEach(function (customFlagProperty) {
                if (typeof customFlagProperty === 'number' || typeof customFlagProperty === 'string' || typeof customFlagProperty === 'boolean') {
                  valueArray.push(customFlagProperty.toString());
                }
              });
            } else if (typeof event.CustomFlags[prop] === 'number' || typeof event.CustomFlags[prop] === 'string' || typeof event.CustomFlags[prop] === 'boolean') {
              valueArray.push(event.CustomFlags[prop].toString());
            }

            if (valueArray.length) {
              dto.flags[prop] = valueArray;
            }
          }
        }
      }

      this.appendUserInfo = function (user, event) {
        if (!event) {
          return;
        }

        if (!user) {
          event.MPID = null;
          event.ConsentState = null;
          event.UserAttributes = null;
          event.UserIdentities = null;
          return;
        }

        if (event.MPID && event.MPID === user.getMPID()) {
          return;
        }

        event.MPID = user.getMPID();
        event.ConsentState = user.getConsentState();
        event.UserAttributes = user.getAllUserAttributes();
        var userIdentities = user.getUserIdentities().userIdentities;
        var dtoUserIdentities = {};

        for (var identityKey in userIdentities) {
          var identityType = Types.IdentityType.getIdentityType(identityKey);

          if (identityType !== false) {
            dtoUserIdentities[identityType] = userIdentities[identityKey];
          }
        }

        var validUserIdentities = [];

        if (mpInstance._Helpers.isObject(dtoUserIdentities)) {
          if (Object.keys(dtoUserIdentities).length) {
            for (var key in dtoUserIdentities) {
              var userIdentity = {};
              userIdentity.Identity = dtoUserIdentities[key];
              userIdentity.Type = mpInstance._Helpers.parseNumber(key);
              validUserIdentities.push(userIdentity);
            }
          }
        }

        event.UserIdentities = validUserIdentities;
      };

      function convertProductListToDTO(productList) {
        if (!productList) {
          return [];
        }

        return productList.map(function (product) {
          return convertProductToDTO(product);
        });
      }

      function convertProductToDTO(product) {
        return {
          id: mpInstance._Helpers.parseStringOrNumber(product.Sku),
          nm: mpInstance._Helpers.parseStringOrNumber(product.Name),
          pr: mpInstance._Helpers.parseNumber(product.Price),
          qt: mpInstance._Helpers.parseNumber(product.Quantity),
          br: mpInstance._Helpers.parseStringOrNumber(product.Brand),
          va: mpInstance._Helpers.parseStringOrNumber(product.Variant),
          ca: mpInstance._Helpers.parseStringOrNumber(product.Category),
          ps: mpInstance._Helpers.parseNumber(product.Position),
          cc: mpInstance._Helpers.parseStringOrNumber(product.CouponCode),
          tpa: mpInstance._Helpers.parseNumber(product.TotalAmount),
          attrs: product.Attributes
        };
      }

      this.convertToConsentStateDTO = function (state) {
        if (!state) {
          return null;
        }

        var jsonObject = {};
        var gdprConsentState = state.getGDPRConsentState();

        if (gdprConsentState) {
          var gdpr = {};
          jsonObject.gdpr = gdpr;

          for (var purpose in gdprConsentState) {
            if (gdprConsentState.hasOwnProperty(purpose)) {
              var gdprConsent = gdprConsentState[purpose];
              jsonObject.gdpr[purpose] = {};

              if (typeof gdprConsent.Consented === 'boolean') {
                gdpr[purpose].c = gdprConsent.Consented;
              }

              if (typeof gdprConsent.Timestamp === 'number') {
                gdpr[purpose].ts = gdprConsent.Timestamp;
              }

              if (typeof gdprConsent.ConsentDocument === 'string') {
                gdpr[purpose].d = gdprConsent.ConsentDocument;
              }

              if (typeof gdprConsent.Location === 'string') {
                gdpr[purpose].l = gdprConsent.Location;
              }

              if (typeof gdprConsent.HardwareId === 'string') {
                gdpr[purpose].h = gdprConsent.HardwareId;
              }
            }
          }
        }

        var ccpaConsentState = state.getCCPAConsentState();

        if (ccpaConsentState) {
          jsonObject.ccpa = {
            data_sale_opt_out: {
              c: ccpaConsentState.Consented,
              ts: ccpaConsentState.Timestamp,
              d: ccpaConsentState.ConsentDocument,
              l: ccpaConsentState.Location,
              h: ccpaConsentState.HardwareId
            }
          };
        }

        return jsonObject;
      };

      this.createEventObject = function (event, user) {
        var uploadObject = {};
        var eventObject = {};
        var optOut = event.messageType === Types.MessageType.OptOut ? !mpInstance._Store.isEnabled : null;

        if (mpInstance._Store.sessionId || event.messageType == Types.MessageType.OptOut || mpInstance._Store.webviewBridgeEnabled) {
          if (event.hasOwnProperty('toEventAPIObject')) {
            eventObject = event.toEventAPIObject();
          } else {
            eventObject = {
              EventName: event.name || event.messageType,
              EventCategory: event.eventType,
              EventAttributes: mpInstance._Helpers.sanitizeAttributes(event.data, event.name),
              SourceMessageId: event.sourceMessageId || mpInstance._Helpers.generateUniqueId(),
              EventDataType: event.messageType,
              CustomFlags: event.customFlags || {},
              UserAttributeChanges: event.userAttributeChanges,
              UserIdentityChanges: event.userIdentityChanges
            };
          }

          if (event.messageType !== Types.MessageType.SessionEnd) {
            mpInstance._Store.dateLastEventSent = new Date();
          }

          uploadObject = {
            Store: mpInstance._Store.serverSettings,
            SDKVersion: Constants.sdkVersion,
            SessionId: mpInstance._Store.sessionId,
            SessionStartDate: mpInstance._Store.sessionStartDate ? mpInstance._Store.sessionStartDate.getTime() : 0,
            Debug: mpInstance._Store.SDKConfig.isDevelopmentMode,
            Location: mpInstance._Store.currentPosition,
            OptOut: optOut,
            ExpandedEventCount: 0,
            AppVersion: mpInstance.getAppVersion(),
            AppName: mpInstance.getAppName(),
            ClientGeneratedId: mpInstance._Store.clientId,
            DeviceId: mpInstance._Store.deviceId,
            IntegrationAttributes: mpInstance._Store.integrationAttributes,
            CurrencyCode: mpInstance._Store.currencyCode,
            DataPlan: mpInstance._Store.SDKConfig.dataPlan ? mpInstance._Store.SDKConfig.dataPlan : {}
          };

          if (eventObject.EventDataType === MessageType$1.AppStateTransition) {
            eventObject.IsFirstRun = mpInstance._Store.isFirstRun;
          }

          eventObject.CurrencyCode = mpInstance._Store.currencyCode;
          var currentUser = user || mpInstance.Identity.getCurrentUser();
          self.appendUserInfo(currentUser, eventObject);

          if (event.messageType === Types.MessageType.SessionEnd) {
            eventObject.SessionLength = mpInstance._Store.dateLastEventSent.getTime() - mpInstance._Store.sessionStartDate.getTime();
            eventObject.currentSessionMPIDs = mpInstance._Store.currentSessionMPIDs;
            eventObject.EventAttributes = mpInstance._Store.sessionAttributes;
            mpInstance._Store.currentSessionMPIDs = [];
            mpInstance._Store.sessionStartDate = null;
          }

          uploadObject.Timestamp = mpInstance._Store.dateLastEventSent.getTime();
          return mpInstance._Helpers.extend({}, eventObject, uploadObject);
        }

        return null;
      };

      this.convertEventToDTO = function (event) {
        var dto = {
          n: event.EventName,
          et: event.EventCategory,
          ua: event.UserAttributes,
          ui: event.UserIdentities,
          ia: event.IntegrationAttributes,
          str: event.Store,
          attrs: event.EventAttributes,
          sdk: event.SDKVersion,
          sid: event.SessionId,
          sl: event.SessionLength,
          ssd: event.SessionStartDate,
          dt: event.EventDataType,
          dbg: event.Debug,
          ct: event.Timestamp,
          lc: event.Location,
          o: event.OptOut,
          eec: event.ExpandedEventCount,
          av: event.AppVersion,
          cgid: event.ClientGeneratedId,
          das: event.DeviceId,
          mpid: event.MPID,
          smpids: event.currentSessionMPIDs
        };

        if (event.DataPlan && event.DataPlan.PlanId) {
          dto.dp_id = event.DataPlan.PlanId;

          if (event.DataPlan.PlanVersion) {
            dto.dp_v = event.DataPlan.PlanVersion;
          }
        }

        var consent = self.convertToConsentStateDTO(event.ConsentState);

        if (consent) {
          dto.con = consent;
        }

        if (event.EventDataType === MessageType$1.AppStateTransition) {
          dto.fr = event.IsFirstRun;
          dto.iu = false;
          dto.at = ApplicationTransitionType$1.AppInit;
          dto.lr = window.location.href || null;
          dto.attrs = null;
        }

        if (event.CustomFlags) {
          convertCustomFlags(event, dto);
        }

        if (event.EventDataType === MessageType$1.Commerce) {
          dto.cu = event.CurrencyCode;

          if (event.ShoppingCart) {
            dto.sc = {
              pl: convertProductListToDTO(event.ShoppingCart.ProductList)
            };
          }

          if (event.ProductAction) {
            dto.pd = {
              an: event.ProductAction.ProductActionType,
              cs: mpInstance._Helpers.parseNumber(event.ProductAction.CheckoutStep),
              co: event.ProductAction.CheckoutOptions,
              pl: convertProductListToDTO(event.ProductAction.ProductList),
              ti: event.ProductAction.TransactionId,
              ta: event.ProductAction.Affiliation,
              tcc: event.ProductAction.CouponCode,
              tr: mpInstance._Helpers.parseNumber(event.ProductAction.TotalAmount),
              ts: mpInstance._Helpers.parseNumber(event.ProductAction.ShippingAmount),
              tt: mpInstance._Helpers.parseNumber(event.ProductAction.TaxAmount)
            };
          } else if (event.PromotionAction) {
            dto.pm = {
              an: event.PromotionAction.PromotionActionType,
              pl: event.PromotionAction.PromotionList.map(function (promotion) {
                return {
                  id: promotion.Id,
                  nm: promotion.Name,
                  cr: promotion.Creative,
                  ps: promotion.Position ? promotion.Position : 0
                };
              })
            };
          } else if (event.ProductImpressions) {
            dto.pi = event.ProductImpressions.map(function (impression) {
              return {
                pil: impression.ProductImpressionList,
                pl: convertProductListToDTO(impression.ProductList)
              };
            });
          }
        } else if (event.EventDataType === MessageType$1.Profile) {
          dto.pet = event.ProfileMessageType;
        }

        return dto;
      };
    }

    function forwardingStatsUploader(mpInstance) {
      this.startForwardingStatsTimer = function () {
        mParticle._forwardingStatsTimer = setInterval(function () {
          prepareAndSendForwardingStatsBatch();
        }, mpInstance._Store.SDKConfig.forwarderStatsTimeout);
      };

      function prepareAndSendForwardingStatsBatch() {
        var forwarderQueue = mpInstance._Forwarders.getForwarderStatsQueue(),
            uploadsTable = mpInstance._Persistence.forwardingStatsBatches.uploadsTable,
            now = Date.now();

        if (forwarderQueue.length) {
          uploadsTable[now] = {
            uploading: false,
            data: forwarderQueue
          };

          mpInstance._Forwarders.setForwarderStatsQueue([]);
        }

        for (var date in uploadsTable) {
          (function (date) {
            if (uploadsTable.hasOwnProperty(date)) {
              if (uploadsTable[date].uploading === false) {
                var xhrCallback = function xhrCallback() {
                  if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 202) {
                      mpInstance.Logger.verbose('Successfully sent  ' + xhr.statusText + ' from server');
                      delete uploadsTable[date];
                    } else if (xhr.status.toString()[0] === '4') {
                      if (xhr.status !== 429) {
                        delete uploadsTable[date];
                      }
                    } else {
                      uploadsTable[date].uploading = false;
                    }
                  }
                };

                var xhr = mpInstance._Helpers.createXHR(xhrCallback);

                var forwardingStatsData = uploadsTable[date].data;
                uploadsTable[date].uploading = true;

                mpInstance._APIClient.sendBatchForwardingStatsToServer(forwardingStatsData, xhr);
              }
            }
          })(date);
        }
      }
    }

    var Messages$7 = Constants.Messages,
        HTTPCodes = Constants.HTTPCodes;
    function Identity(mpInstance) {
      var self = this;

      this.checkIdentitySwap = function (previousMPID, currentMPID, currentSessionMPIDs) {
        if (previousMPID && currentMPID && previousMPID !== currentMPID) {
          var persistence = mpInstance._Persistence.getPersistence();

          if (persistence) {
            persistence.cu = currentMPID;
            persistence.gs.csm = currentSessionMPIDs;

            mpInstance._Persistence.savePersistence(persistence);
          }
        }
      };

      this.IdentityRequest = {
        createKnownIdentities: function createKnownIdentities(identityApiData, deviceId) {
          var identitiesResult = {};

          if (identityApiData && identityApiData.userIdentities && mpInstance._Helpers.isObject(identityApiData.userIdentities)) {
            for (var identity in identityApiData.userIdentities) {
              identitiesResult[identity] = identityApiData.userIdentities[identity];
            }
          }

          identitiesResult.device_application_stamp = deviceId;
          return identitiesResult;
        },
        preProcessIdentityRequest: function preProcessIdentityRequest(identityApiData, callback, method) {
          mpInstance.Logger.verbose(Messages$7.InformationMessages.StartingLogEvent + ': ' + method);

          var identityValidationResult = mpInstance._Helpers.Validators.validateIdentities(identityApiData, method);

          if (!identityValidationResult.valid) {
            mpInstance.Logger.error('ERROR: ' + identityValidationResult.error);
            return {
              valid: false,
              error: identityValidationResult.error
            };
          }

          if (callback && !mpInstance._Helpers.Validators.isFunction(callback)) {
            var error = 'The optional callback must be a function. You tried entering a(n) ' + _typeof(callback);

            mpInstance.Logger.error(error);
            return {
              valid: false,
              error: error
            };
          }

          return {
            valid: true
          };
        },
        createIdentityRequest: function createIdentityRequest(identityApiData, platform, sdkVendor, sdkVersion, deviceId, context, mpid) {
          var APIRequest = {
            client_sdk: {
              platform: platform,
              sdk_vendor: sdkVendor,
              sdk_version: sdkVersion
            },
            context: context,
            environment: mpInstance._Store.SDKConfig.isDevelopmentMode ? 'development' : 'production',
            request_id: mpInstance._Helpers.generateUniqueId(),
            request_timestamp_ms: new Date().getTime(),
            previous_mpid: mpid || null,
            known_identities: this.createKnownIdentities(identityApiData, deviceId)
          };
          return APIRequest;
        },
        createModifyIdentityRequest: function createModifyIdentityRequest(currentUserIdentities, newUserIdentities, platform, sdkVendor, sdkVersion, context) {
          return {
            client_sdk: {
              platform: platform,
              sdk_vendor: sdkVendor,
              sdk_version: sdkVersion
            },
            context: context,
            environment: mpInstance._Store.SDKConfig.isDevelopmentMode ? 'development' : 'production',
            request_id: mpInstance._Helpers.generateUniqueId(),
            request_timestamp_ms: new Date().getTime(),
            identity_changes: this.createIdentityChanges(currentUserIdentities, newUserIdentities)
          };
        },
        createIdentityChanges: function createIdentityChanges(previousIdentities, newIdentities) {
          var identityChanges = [];
          var key;

          if (newIdentities && mpInstance._Helpers.isObject(newIdentities) && previousIdentities && mpInstance._Helpers.isObject(previousIdentities)) {
            for (key in newIdentities) {
              identityChanges.push({
                old_value: previousIdentities[key] || null,
                new_value: newIdentities[key],
                identity_type: key
              });
            }
          }

          return identityChanges;
        },
        // takes 2 UI objects keyed by name, combines them, returns them keyed by type
        combineUserIdentities: function combineUserIdentities(previousUIByName, newUIByName) {
          var combinedUIByType = {};

          var combinedUIByName = mpInstance._Helpers.extend(previousUIByName, newUIByName);

          for (var key in combinedUIByName) {
            var type = Types.IdentityType.getIdentityType(key); // this check removes anything that is not whitelisted as an identity type

            if (type !== false && type >= 0) {
              combinedUIByType[Types.IdentityType.getIdentityType(key)] = combinedUIByName[key];
            }
          }

          return combinedUIByType;
        },
        createAliasNetworkRequest: function createAliasNetworkRequest(aliasRequest) {
          return {
            request_id: mpInstance._Helpers.generateUniqueId(),
            request_type: 'alias',
            environment: mpInstance._Store.SDKConfig.isDevelopmentMode ? 'development' : 'production',
            api_key: mpInstance._Store.devToken,
            data: {
              destination_mpid: aliasRequest.destinationMpid,
              source_mpid: aliasRequest.sourceMpid,
              start_unixtime_ms: aliasRequest.startTime,
              end_unixtime_ms: aliasRequest.endTime,
              device_application_stamp: mpInstance._Store.deviceId
            }
          };
        },
        convertAliasToNative: function convertAliasToNative(aliasRequest) {
          return {
            DestinationMpid: aliasRequest.destinationMpid,
            SourceMpid: aliasRequest.sourceMpid,
            StartUnixtimeMs: aliasRequest.startTime,
            EndUnixtimeMs: aliasRequest.endTime
          };
        },
        convertToNative: function convertToNative(identityApiData) {
          var nativeIdentityRequest = [];

          if (identityApiData && identityApiData.userIdentities) {
            for (var key in identityApiData.userIdentities) {
              if (identityApiData.userIdentities.hasOwnProperty(key)) {
                nativeIdentityRequest.push({
                  Type: Types.IdentityType.getIdentityType(key),
                  Identity: identityApiData.userIdentities[key]
                });
              }
            }

            return {
              UserIdentities: nativeIdentityRequest
            };
          }
        }
      };
      /**
       * Invoke these methods on the mParticle.Identity object.
       * Example: mParticle.Identity.getCurrentUser().
       * @class mParticle.Identity
       */

      this.IdentityAPI = {
        HTTPCodes: HTTPCodes,

        /**
         * Initiate a logout request to the mParticle server
         * @method identify
         * @param {Object} identityApiData The identityApiData object as indicated [here](https://github.com/mParticle/mparticle-sdk-javascript/blob/master-v2/README.md#1-customize-the-sdk)
         * @param {Function} [callback] A callback function that is called when the identify request completes
         */
        identify: function identify(identityApiData, callback) {
          var mpid,
              currentUser = mpInstance.Identity.getCurrentUser(),
              preProcessResult = mpInstance._Identity.IdentityRequest.preProcessIdentityRequest(identityApiData, callback, 'identify');

          if (currentUser) {
            mpid = currentUser.getMPID();
          }

          if (preProcessResult.valid) {
            var identityApiRequest = mpInstance._Identity.IdentityRequest.createIdentityRequest(identityApiData, Constants.platform, Constants.sdkVendor, Constants.sdkVersion, mpInstance._Store.deviceId, mpInstance._Store.context, mpid);

            if (mpInstance._Helpers.canLog()) {
              if (mpInstance._Store.webviewBridgeEnabled) {
                mpInstance._NativeSdkHelpers.sendToNative(Constants.NativeSdkPaths.Identify, JSON.stringify(mpInstance._Identity.IdentityRequest.convertToNative(identityApiData)));

                mpInstance._Helpers.invokeCallback(callback, HTTPCodes.nativeIdentityRequest, 'Identify request sent to native sdk');
              } else {
                mpInstance._IdentityAPIClient.sendIdentityRequest(identityApiRequest, 'identify', callback, identityApiData, self.parseIdentityResponse, mpid);
              }
            } else {
              mpInstance._Helpers.invokeCallback(callback, HTTPCodes.loggingDisabledOrMissingAPIKey, Messages$7.InformationMessages.AbandonLogEvent);

              mpInstance.Logger.verbose(Messages$7.InformationMessages.AbandonLogEvent);
            }
          } else {
            mpInstance._Helpers.invokeCallback(callback, HTTPCodes.validationIssue, preProcessResult.error);

            mpInstance.Logger.verbose(preProcessResult);
          }
        },

        /**
         * Initiate a logout request to the mParticle server
         * @method logout
         * @param {Object} identityApiData The identityApiData object as indicated [here](https://github.com/mParticle/mparticle-sdk-javascript/blob/master-v2/README.md#1-customize-the-sdk)
         * @param {Function} [callback] A callback function that is called when the logout request completes
         */
        logout: function logout(identityApiData, callback) {
          var mpid,
              currentUser = mpInstance.Identity.getCurrentUser(),
              preProcessResult = mpInstance._Identity.IdentityRequest.preProcessIdentityRequest(identityApiData, callback, 'logout');

          if (currentUser) {
            mpid = currentUser.getMPID();
          }

          if (preProcessResult.valid) {
            var evt,
                identityApiRequest = mpInstance._Identity.IdentityRequest.createIdentityRequest(identityApiData, Constants.platform, Constants.sdkVendor, Constants.sdkVersion, mpInstance._Store.deviceId, mpInstance._Store.context, mpid);

            if (mpInstance._Helpers.canLog()) {
              if (mpInstance._Store.webviewBridgeEnabled) {
                mpInstance._NativeSdkHelpers.sendToNative(Constants.NativeSdkPaths.Logout, JSON.stringify(mpInstance._Identity.IdentityRequest.convertToNative(identityApiData)));

                mpInstance._Helpers.invokeCallback(callback, HTTPCodes.nativeIdentityRequest, 'Logout request sent to native sdk');
              } else {
                mpInstance._IdentityAPIClient.sendIdentityRequest(identityApiRequest, 'logout', callback, identityApiData, self.parseIdentityResponse, mpid);

                evt = mpInstance._ServerModel.createEventObject({
                  messageType: Types.MessageType.Profile
                });
                evt.ProfileMessageType = Types.ProfileMessageType.Logout;

                if (mpInstance._Store.activeForwarders.length) {
                  mpInstance._Store.activeForwarders.forEach(function (forwarder) {
                    if (forwarder.logOut) {
                      forwarder.logOut(evt);
                    }
                  });
                }
              }
            } else {
              mpInstance._Helpers.invokeCallback(callback, HTTPCodes.loggingDisabledOrMissingAPIKey, Messages$7.InformationMessages.AbandonLogEvent);

              mpInstance.Logger.verbose(Messages$7.InformationMessages.AbandonLogEvent);
            }
          } else {
            mpInstance._Helpers.invokeCallback(callback, HTTPCodes.validationIssue, preProcessResult.error);

            mpInstance.Logger.verbose(preProcessResult);
          }
        },

        /**
         * Initiate a login request to the mParticle server
         * @method login
         * @param {Object} identityApiData The identityApiData object as indicated [here](https://github.com/mParticle/mparticle-sdk-javascript/blob/master-v2/README.md#1-customize-the-sdk)
         * @param {Function} [callback] A callback function that is called when the login request completes
         */
        login: function login(identityApiData, callback) {
          var mpid,
              currentUser = mpInstance.Identity.getCurrentUser(),
              preProcessResult = mpInstance._Identity.IdentityRequest.preProcessIdentityRequest(identityApiData, callback, 'login');

          if (currentUser) {
            mpid = currentUser.getMPID();
          }

          if (preProcessResult.valid) {
            var identityApiRequest = mpInstance._Identity.IdentityRequest.createIdentityRequest(identityApiData, Constants.platform, Constants.sdkVendor, Constants.sdkVersion, mpInstance._Store.deviceId, mpInstance._Store.context, mpid);

            if (mpInstance._Helpers.canLog()) {
              if (mpInstance._Store.webviewBridgeEnabled) {
                mpInstance._NativeSdkHelpers.sendToNative(Constants.NativeSdkPaths.Login, JSON.stringify(mpInstance._Identity.IdentityRequest.convertToNative(identityApiData)));

                mpInstance._Helpers.invokeCallback(callback, HTTPCodes.nativeIdentityRequest, 'Login request sent to native sdk');
              } else {
                mpInstance._IdentityAPIClient.sendIdentityRequest(identityApiRequest, 'login', callback, identityApiData, self.parseIdentityResponse, mpid);
              }
            } else {
              mpInstance._Helpers.invokeCallback(callback, HTTPCodes.loggingDisabledOrMissingAPIKey, Messages$7.InformationMessages.AbandonLogEvent);

              mpInstance.Logger.verbose(Messages$7.InformationMessages.AbandonLogEvent);
            }
          } else {
            mpInstance._Helpers.invokeCallback(callback, HTTPCodes.validationIssue, preProcessResult.error);

            mpInstance.Logger.verbose(preProcessResult);
          }
        },

        /**
         * Initiate a modify request to the mParticle server
         * @method modify
         * @param {Object} identityApiData The identityApiData object as indicated [here](https://github.com/mParticle/mparticle-sdk-javascript/blob/master-v2/README.md#1-customize-the-sdk)
         * @param {Function} [callback] A callback function that is called when the modify request completes
         */
        modify: function modify(identityApiData, callback) {
          var mpid,
              currentUser = mpInstance.Identity.getCurrentUser(),
              preProcessResult = mpInstance._Identity.IdentityRequest.preProcessIdentityRequest(identityApiData, callback, 'modify');

          if (currentUser) {
            mpid = currentUser.getMPID();
          }

          var newUserIdentities = identityApiData && identityApiData.userIdentities ? identityApiData.userIdentities : {};

          if (preProcessResult.valid) {
            var identityApiRequest = mpInstance._Identity.IdentityRequest.createModifyIdentityRequest(currentUser ? currentUser.getUserIdentities().userIdentities : {}, newUserIdentities, Constants.platform, Constants.sdkVendor, Constants.sdkVersion, mpInstance._Store.context);

            if (mpInstance._Helpers.canLog()) {
              if (mpInstance._Store.webviewBridgeEnabled) {
                mpInstance._NativeSdkHelpers.sendToNative(Constants.NativeSdkPaths.Modify, JSON.stringify(mpInstance._Identity.IdentityRequest.convertToNative(identityApiData)));

                mpInstance._Helpers.invokeCallback(callback, HTTPCodes.nativeIdentityRequest, 'Modify request sent to native sdk');
              } else {
                mpInstance._IdentityAPIClient.sendIdentityRequest(identityApiRequest, 'modify', callback, identityApiData, self.parseIdentityResponse, mpid);
              }
            } else {
              mpInstance._Helpers.invokeCallback(callback, HTTPCodes.loggingDisabledOrMissingAPIKey, Messages$7.InformationMessages.AbandonLogEvent);

              mpInstance.Logger.verbose(Messages$7.InformationMessages.AbandonLogEvent);
            }
          } else {
            mpInstance._Helpers.invokeCallback(callback, HTTPCodes.validationIssue, preProcessResult.error);

            mpInstance.Logger.verbose(preProcessResult);
          }
        },

        /**
         * Returns a user object with methods to interact with the current user
         * @method getCurrentUser
         * @return {Object} the current user object
         */
        getCurrentUser: function getCurrentUser() {
          var mpid;

          if (mpInstance._Store) {
            mpid = mpInstance._Store.mpid;

            if (mpid) {
              mpid = mpInstance._Store.mpid.slice();
              return self.mParticleUser(mpid, mpInstance._Store.isLoggedIn);
            } else if (mpInstance._Store.webviewBridgeEnabled) {
              return self.mParticleUser();
            } else {
              return null;
            }
          } else {
            return null;
          }
        },

        /**
         * Returns a the user object associated with the mpid parameter or 'null' if no such
         * user exists
         * @method getUser
         * @param {String} mpid of the desired user
         * @return {Object} the user for  mpid
         */
        getUser: function getUser(mpid) {
          var persistence = mpInstance._Persistence.getPersistence();

          if (persistence) {
            if (persistence[mpid] && !Constants.SDKv2NonMPIDCookieKeys.hasOwnProperty(mpid)) {
              return self.mParticleUser(mpid);
            } else {
              return null;
            }
          } else {
            return null;
          }
        },

        /**
         * Returns all users, including the current user and all previous users that are stored on the device.
         * @method getUsers
         * @return {Array} array of users
         */
        getUsers: function getUsers() {
          var persistence = mpInstance._Persistence.getPersistence();

          var users = [];

          if (persistence) {
            for (var key in persistence) {
              if (!Constants.SDKv2NonMPIDCookieKeys.hasOwnProperty(key)) {
                users.push(self.mParticleUser(key));
              }
            }
          }

          users.sort(function (a, b) {
            var aLastSeen = a.getLastSeenTime() || 0;
            var bLastSeen = b.getLastSeenTime() || 0;

            if (aLastSeen > bLastSeen) {
              return -1;
            } else {
              return 1;
            }
          });
          return users;
        },

        /**
         * Initiate an alias request to the mParticle server
         * @method aliasUsers
         * @param {Object} aliasRequest  object representing an AliasRequest
         * @param {Function} [callback] A callback function that is called when the aliasUsers request completes
         */
        aliasUsers: function aliasUsers(aliasRequest, callback) {
          var message;

          if (!aliasRequest.destinationMpid || !aliasRequest.sourceMpid) {
            message = Messages$7.ValidationMessages.AliasMissingMpid;
          }

          if (aliasRequest.destinationMpid === aliasRequest.sourceMpid) {
            message = Messages$7.ValidationMessages.AliasNonUniqueMpid;
          }

          if (!aliasRequest.startTime || !aliasRequest.endTime) {
            message = Messages$7.ValidationMessages.AliasMissingTime;
          }

          if (aliasRequest.startTime > aliasRequest.endTime) {
            message = Messages$7.ValidationMessages.AliasStartBeforeEndTime;
          }

          if (message) {
            mpInstance.Logger.warning(message);

            mpInstance._Helpers.invokeAliasCallback(callback, HTTPCodes.validationIssue, message);

            return;
          }

          if (mpInstance._Helpers.canLog()) {
            if (mpInstance._Store.webviewBridgeEnabled) {
              mpInstance._NativeSdkHelpers.sendToNative(Constants.NativeSdkPaths.Alias, JSON.stringify(mpInstance._Identity.IdentityRequest.convertAliasToNative(aliasRequest)));

              mpInstance._Helpers.invokeAliasCallback(callback, HTTPCodes.nativeIdentityRequest, 'Alias request sent to native sdk');
            } else {
              mpInstance.Logger.verbose(Messages$7.InformationMessages.StartingAliasRequest + ': ' + aliasRequest.sourceMpid + ' -> ' + aliasRequest.destinationMpid);

              var aliasRequestMessage = mpInstance._Identity.IdentityRequest.createAliasNetworkRequest(aliasRequest);

              mpInstance._IdentityAPIClient.sendAliasRequest(aliasRequestMessage, callback);
            }
          } else {
            mpInstance._Helpers.invokeAliasCallback(callback, HTTPCodes.loggingDisabledOrMissingAPIKey, Messages$7.InformationMessages.AbandonAliasUsers);

            mpInstance.Logger.verbose(Messages$7.InformationMessages.AbandonAliasUsers);
          }
        },

        /**
         Create a default AliasRequest for 2 MParticleUsers. This will construct the request
        using the sourceUser's firstSeenTime as the startTime, and its lastSeenTime as the endTime.
        
        In the unlikely scenario that the sourceUser does not have a firstSeenTime, which will only
        be the case if they have not been the current user since this functionality was added, the 
        startTime will be populated with the earliest firstSeenTime out of any stored user. Similarly,
        if the sourceUser does not have a lastSeenTime, the endTime will be populated with the current time
        
        There is a limit to how old the startTime can be, represented by the config field 'aliasMaxWindow', in days.
        If the startTime falls before the limit, it will be adjusted to the oldest allowed startTime. 
        In rare cases, where the sourceUser's lastSeenTime also falls outside of the aliasMaxWindow limit, 
        after applying this adjustment it will be impossible to create an aliasRequest passes the aliasUsers() 
        validation that the startTime must be less than the endTime 
        */
        createAliasRequest: function createAliasRequest(sourceUser, destinationUser) {
          try {
            if (!destinationUser || !sourceUser) {
              mpInstance.Logger.error("'destinationUser' and 'sourceUser' must both be present");
              return null;
            }

            var startTime = sourceUser.getFirstSeenTime();

            if (!startTime) {
              mpInstance.Identity.getUsers().forEach(function (user) {
                if (user.getFirstSeenTime() && (!startTime || user.getFirstSeenTime() < startTime)) {
                  startTime = user.getFirstSeenTime();
                }
              });
            }

            var minFirstSeenTimeMs = new Date().getTime() - mpInstance._Store.SDKConfig.aliasMaxWindow * 24 * 60 * 60 * 1000;
            var endTime = sourceUser.getLastSeenTime() || new Date().getTime(); //if the startTime is greater than $maxAliasWindow ago, adjust the startTime to the earliest allowed

            if (startTime < minFirstSeenTimeMs) {
              startTime = minFirstSeenTimeMs;

              if (endTime < startTime) {
                mpInstance.Logger.warning('Source User has not been seen in the last ' + mpInstance._Store.SDKConfig.maxAliasWindow + ' days, Alias Request will likely fail');
              }
            }

            return {
              destinationMpid: destinationUser.getMPID(),
              sourceMpid: sourceUser.getMPID(),
              startTime: startTime,
              endTime: endTime
            };
          } catch (e) {
            mpInstance.Logger.error('There was a problem with creating an alias request: ' + e);
            return null;
          }
        }
      };
      /**
       * Invoke these methods on the mParticle.Identity.getCurrentUser() object.
       * Example: mParticle.Identity.getCurrentUser().getAllUserAttributes()
       * @class mParticle.Identity.getCurrentUser()
       */

      this.mParticleUser = function (mpid, _isLoggedIn) {
        var self = this;
        return {
          /**
           * Get user identities for current user
           * @method getUserIdentities
           * @return {Object} an object with userIdentities as its key
           */
          getUserIdentities: function getUserIdentities() {
            var currentUserIdentities = {};

            var identities = mpInstance._Persistence.getUserIdentities(mpid);

            for (var identityType in identities) {
              if (identities.hasOwnProperty(identityType)) {
                currentUserIdentities[Types.IdentityType.getIdentityName(mpInstance._Helpers.parseNumber(identityType))] = identities[identityType];
              }
            }

            return {
              userIdentities: currentUserIdentities
            };
          },

          /**
           * Get the MPID of the current user
           * @method getMPID
           * @return {String} the current user MPID as a string
           */
          getMPID: function getMPID() {
            return mpid;
          },

          /**
           * Sets a user tag
           * @method setUserTag
           * @param {String} tagName
           */
          setUserTag: function setUserTag(tagName) {
            if (!mpInstance._Helpers.Validators.isValidKeyValue(tagName)) {
              mpInstance.Logger.error(Messages$7.ErrorMessages.BadKey);
              return;
            }

            this.setUserAttribute(tagName, null);
          },

          /**
           * Removes a user tag
           * @method removeUserTag
           * @param {String} tagName
           */
          removeUserTag: function removeUserTag(tagName) {
            if (!mpInstance._Helpers.Validators.isValidKeyValue(tagName)) {
              mpInstance.Logger.error(Messages$7.ErrorMessages.BadKey);
              return;
            }

            this.removeUserAttribute(tagName);
          },

          /**
           * Sets a user attribute
           * @method setUserAttribute
           * @param {String} key
           * @param {String} value
           */
          setUserAttribute: function setUserAttribute(key, newValue) {
            var cookies, userAttributes, previousUserAttributeValue, isNewAttribute;

            mpInstance._SessionManager.resetSessionTimer();

            if (mpInstance._Helpers.canLog()) {
              if (!mpInstance._Helpers.Validators.isValidAttributeValue(newValue)) {
                mpInstance.Logger.error(Messages$7.ErrorMessages.BadAttribute);
                return;
              }

              if (!mpInstance._Helpers.Validators.isValidKeyValue(key)) {
                mpInstance.Logger.error(Messages$7.ErrorMessages.BadKey);
                return;
              }

              if (mpInstance._Store.webviewBridgeEnabled) {
                mpInstance._NativeSdkHelpers.sendToNative(Constants.NativeSdkPaths.SetUserAttribute, JSON.stringify({
                  key: key,
                  value: newValue
                }));
              } else {
                cookies = mpInstance._Persistence.getPersistence();
                userAttributes = this.getAllUserAttributes();

                var existingProp = mpInstance._Helpers.findKeyInObject(userAttributes, key);

                if (existingProp) {
                  isNewAttribute = false;
                  previousUserAttributeValue = userAttributes[existingProp];
                  delete userAttributes[existingProp];
                } else {
                  isNewAttribute = true;
                }

                userAttributes[key] = newValue;

                if (cookies && cookies[mpid]) {
                  cookies[mpid].ua = userAttributes;

                  mpInstance._Persistence.savePersistence(cookies, mpid);
                }

                self.sendUserAttributeChangeEvent(key, newValue, previousUserAttributeValue, isNewAttribute, false, this);

                mpInstance._Forwarders.initForwarders(self.IdentityAPI.getCurrentUser().getUserIdentities(), mpInstance._APIClient.prepareForwardingStats);

                mpInstance._Forwarders.callSetUserAttributeOnForwarders(key, newValue);
              }
            }
          },

          /**
           * Set multiple user attributes
           * @method setUserAttributes
           * @param {Object} user attribute object with keys of the attribute type, and value of the attribute value
           */
          setUserAttributes: function setUserAttributes(userAttributes) {
            mpInstance._SessionManager.resetSessionTimer();

            if (mpInstance._Helpers.isObject(userAttributes)) {
              if (mpInstance._Helpers.canLog()) {
                for (var key in userAttributes) {
                  if (userAttributes.hasOwnProperty(key)) {
                    this.setUserAttribute(key, userAttributes[key]);
                  }
                }
              }
            } else {
              mpInstance.Logger.error('Must pass an object into setUserAttributes. You passed a ' + _typeof(userAttributes));
            }
          },

          /**
           * Removes a specific user attribute
           * @method removeUserAttribute
           * @param {String} key
           */
          removeUserAttribute: function removeUserAttribute(key) {
            var cookies, userAttributes;

            mpInstance._SessionManager.resetSessionTimer();

            if (!mpInstance._Helpers.Validators.isValidKeyValue(key)) {
              mpInstance.Logger.error(Messages$7.ErrorMessages.BadKey);
              return;
            }

            if (mpInstance._Store.webviewBridgeEnabled) {
              mpInstance._NativeSdkHelpers.sendToNative(Constants.NativeSdkPaths.RemoveUserAttribute, JSON.stringify({
                key: key,
                value: null
              }));
            } else {
              cookies = mpInstance._Persistence.getPersistence();
              userAttributes = this.getAllUserAttributes();

              var existingProp = mpInstance._Helpers.findKeyInObject(userAttributes, key);

              if (existingProp) {
                key = existingProp;
              }

              var deletedUAKeyCopy = userAttributes[key] ? userAttributes[key].toString() : null;
              delete userAttributes[key];

              if (cookies && cookies[mpid]) {
                cookies[mpid].ua = userAttributes;

                mpInstance._Persistence.savePersistence(cookies, mpid);
              }

              self.sendUserAttributeChangeEvent(key, null, deletedUAKeyCopy, false, true, this);

              mpInstance._Forwarders.initForwarders(self.IdentityAPI.getCurrentUser().getUserIdentities(), mpInstance._APIClient.prepareForwardingStats);

              mpInstance._Forwarders.applyToForwarders('removeUserAttribute', key);
            }
          },

          /**
           * Sets a list of user attributes
           * @method setUserAttributeList
           * @param {String} key
           * @param {Array} value an array of values
           */
          setUserAttributeList: function setUserAttributeList(key, newValue) {
            var cookies, userAttributes, previousUserAttributeValue, isNewAttribute, userAttributeChange;

            mpInstance._SessionManager.resetSessionTimer();

            if (!mpInstance._Helpers.Validators.isValidKeyValue(key)) {
              mpInstance.Logger.error(Messages$7.ErrorMessages.BadKey);
              return;
            }

            if (!Array.isArray(newValue)) {
              mpInstance.Logger.error('The value you passed in to setUserAttributeList must be an array. You passed in a ' + (typeof value === "undefined" ? "undefined" : _typeof(value)));
              return;
            }

            var arrayCopy = newValue.slice();

            if (mpInstance._Store.webviewBridgeEnabled) {
              mpInstance._NativeSdkHelpers.sendToNative(Constants.NativeSdkPaths.SetUserAttributeList, JSON.stringify({
                key: key,
                value: arrayCopy
              }));
            } else {
              cookies = mpInstance._Persistence.getPersistence();
              userAttributes = this.getAllUserAttributes();

              var existingProp = mpInstance._Helpers.findKeyInObject(userAttributes, key);

              if (existingProp) {
                isNewAttribute = false;
                previousUserAttributeValue = userAttributes[existingProp];
                delete userAttributes[existingProp];
              } else {
                isNewAttribute = true;
              }

              userAttributes[key] = arrayCopy;

              if (cookies && cookies[mpid]) {
                cookies[mpid].ua = userAttributes;

                mpInstance._Persistence.savePersistence(cookies, mpid);
              }

              if (mpInstance._APIClient.shouldEnableBatching()) {
                // If the new attributeList length is different previous, then there is a change event.
                // Loop through new attributes list, see if they are all in the same index as previous user attributes list
                // If there are any changes, break, and immediately send a userAttributeChangeEvent with full array as a value
                if (!previousUserAttributeValue || !Array.isArray(previousUserAttributeValue)) {
                  userAttributeChange = true;
                } else if (newValue.length !== previousUserAttributeValue.length) {
                  userAttributeChange = true;
                } else {
                  for (var i = 0; i < newValue.length; i++) {
                    if (previousUserAttributeValue[i] !== newValue[i]) {
                      userAttributeChange = true;
                      break;
                    }
                  }
                }

                if (userAttributeChange) {
                  self.sendUserAttributeChangeEvent(key, newValue, previousUserAttributeValue, isNewAttribute, false, this);
                }
              }

              mpInstance._Forwarders.initForwarders(self.IdentityAPI.getCurrentUser().getUserIdentities(), mpInstance._APIClient.prepareForwardingStats);

              mpInstance._Forwarders.callSetUserAttributeOnForwarders(key, arrayCopy);
            }
          },

          /**
           * Removes all user attributes
           * @method removeAllUserAttributes
           */
          removeAllUserAttributes: function removeAllUserAttributes() {
            var userAttributes;

            mpInstance._SessionManager.resetSessionTimer();

            if (mpInstance._Store.webviewBridgeEnabled) {
              mpInstance._NativeSdkHelpers.sendToNative(Constants.NativeSdkPaths.RemoveAllUserAttributes);
            } else {
              userAttributes = this.getAllUserAttributes();

              mpInstance._Forwarders.initForwarders(self.IdentityAPI.getCurrentUser().getUserIdentities(), mpInstance._APIClient.prepareForwardingStats);

              if (userAttributes) {
                for (var prop in userAttributes) {
                  if (userAttributes.hasOwnProperty(prop)) {
                    mpInstance._Forwarders.applyToForwarders('removeUserAttribute', prop);
                  }

                  this.removeUserAttribute(prop);
                }
              }
            }
          },

          /**
           * Returns all user attribute keys that have values that are arrays
           * @method getUserAttributesLists
           * @return {Object} an object of only keys with array values. Example: { attr1: [1, 2, 3], attr2: ['a', 'b', 'c'] }
           */
          getUserAttributesLists: function getUserAttributesLists() {
            var userAttributes,
                userAttributesLists = {};
            userAttributes = this.getAllUserAttributes();

            for (var key in userAttributes) {
              if (userAttributes.hasOwnProperty(key) && Array.isArray(userAttributes[key])) {
                userAttributesLists[key] = userAttributes[key].slice();
              }
            }

            return userAttributesLists;
          },

          /**
           * Returns all user attributes
           * @method getAllUserAttributes
           * @return {Object} an object of all user attributes. Example: { attr1: 'value1', attr2: ['a', 'b', 'c'] }
           */
          getAllUserAttributes: function getAllUserAttributes() {
            var userAttributesCopy = {};

            var userAttributes = mpInstance._Persistence.getAllUserAttributes(mpid);

            if (userAttributes) {
              for (var prop in userAttributes) {
                if (userAttributes.hasOwnProperty(prop)) {
                  if (Array.isArray(userAttributes[prop])) {
                    userAttributesCopy[prop] = userAttributes[prop].slice();
                  } else {
                    userAttributesCopy[prop] = userAttributes[prop];
                  }
                }
              }
            }

            return userAttributesCopy;
          },

          /**
           * Returns the cart object for the current user
           * @method getCart
           * @return a cart object
           */
          getCart: function getCart() {
            mpInstance.Logger.warning('Deprecated function Identity.getCurrentUser().getCart() will be removed in future releases');
            return self.mParticleUserCart(mpid);
          },

          /**
           * Returns the Consent State stored locally for this user.
           * @method getConsentState
           * @return a ConsentState object
           */
          getConsentState: function getConsentState() {
            return mpInstance._Persistence.getConsentState(mpid);
          },

          /**
           * Sets the Consent State stored locally for this user.
           * @method setConsentState
           * @param {Object} consent state
           */
          setConsentState: function setConsentState(state) {
            mpInstance._Persistence.saveUserConsentStateToCookies(mpid, state);

            mpInstance._Forwarders.initForwarders(this.getUserIdentities().userIdentities, mpInstance._APIClient.prepareForwardingStats);

            mpInstance._CookieSyncManager.attemptCookieSync(null, this.getMPID());
          },
          isLoggedIn: function isLoggedIn() {
            return _isLoggedIn;
          },
          getLastSeenTime: function getLastSeenTime() {
            return mpInstance._Persistence.getLastSeenTime(mpid);
          },
          getFirstSeenTime: function getFirstSeenTime() {
            return mpInstance._Persistence.getFirstSeenTime(mpid);
          }
        };
      };
      /**
       * Invoke these methods on the mParticle.Identity.getCurrentUser().getCart() object.
       * Example: mParticle.Identity.getCurrentUser().getCart().add(...);
       * @class mParticle.Identity.getCurrentUser().getCart()
       * @deprecated
       */


      this.mParticleUserCart = function (mpid) {
        return {
          /**
           * Adds a cart product to the user cart
           * @method add
           * @param {Object} product the product
           * @param {Boolean} [logEvent] a boolean to log adding of the cart object. If blank, no logging occurs.
           * @deprecated
           */
          add: function add(product, logEvent) {
            mpInstance.Logger.warning('Deprecated function Identity.getCurrentUser().getCart().add() will be removed in future releases');
            var allProducts, userProducts, arrayCopy;
            arrayCopy = Array.isArray(product) ? product.slice() : [product];
            arrayCopy.forEach(function (product) {
              product.Attributes = mpInstance._Helpers.sanitizeAttributes(product.Attributes);
            });

            if (mpInstance._Store.webviewBridgeEnabled) {
              mpInstance._NativeSdkHelpers.sendToNative(Constants.NativeSdkPaths.AddToCart, JSON.stringify(arrayCopy));
            } else {
              mpInstance._SessionManager.resetSessionTimer();

              userProducts = mpInstance._Persistence.getUserProductsFromLS(mpid);
              userProducts = userProducts.concat(arrayCopy);

              if (logEvent === true) {
                mpInstance._Events.logProductActionEvent(Types.ProductActionType.AddToCart, arrayCopy);
              }

              var productsForMemory = {};
              productsForMemory[mpid] = {
                cp: userProducts
              };

              if (userProducts.length > mpInstance._Store.SDKConfig.maxProducts) {
                mpInstance.Logger.verbose('The cart contains ' + userProducts.length + ' items. Only ' + mpInstance._Store.SDKConfig.maxProducts + ' can currently be saved in cookies.');
                userProducts = userProducts.slice(-mpInstance._Store.SDKConfig.maxProducts);
              }

              allProducts = mpInstance._Persistence.getAllUserProductsFromLS();
              allProducts[mpid].cp = userProducts;

              mpInstance._Persistence.setCartProducts(allProducts);
            }
          },

          /**
           * Removes a cart product from the current user cart
           * @method remove
           * @param {Object} product the product
           * @param {Boolean} [logEvent] a boolean to log adding of the cart object. If blank, no logging occurs.
           * @deprecated
           */
          remove: function remove(product, logEvent) {
            mpInstance.Logger.warning('Deprecated function Identity.getCurrentUser().getCart().remove() will be removed in future releases');
            var allProducts,
                userProducts,
                cartIndex = -1,
                cartItem = null;

            if (mpInstance._Store.webviewBridgeEnabled) {
              mpInstance._NativeSdkHelpers.sendToNative(Constants.NativeSdkPaths.RemoveFromCart, JSON.stringify(product));
            } else {
              mpInstance._SessionManager.resetSessionTimer();

              userProducts = mpInstance._Persistence.getUserProductsFromLS(mpid);

              if (userProducts) {
                userProducts.forEach(function (cartProduct, i) {
                  if (cartProduct.Sku === product.Sku) {
                    cartIndex = i;
                    cartItem = cartProduct;
                  }
                });

                if (cartIndex > -1) {
                  userProducts.splice(cartIndex, 1);

                  if (logEvent === true) {
                    mpInstance._Events.logProductActionEvent(Types.ProductActionType.RemoveFromCart, cartItem);
                  }
                }
              }

              var productsForMemory = {};
              productsForMemory[mpid] = {
                cp: userProducts
              };
              allProducts = mpInstance._Persistence.getAllUserProductsFromLS();
              allProducts[mpid].cp = userProducts;

              mpInstance._Persistence.setCartProducts(allProducts);
            }
          },

          /**
           * Clears the user's cart
           * @method clear
           * @deprecated
           */
          clear: function clear() {
            mpInstance.Logger.warning('Deprecated function Identity.getCurrentUser().getCart().clear() will be removed in future releases');
            var allProducts;

            if (mpInstance._Store.webviewBridgeEnabled) {
              mpInstance._NativeSdkHelpers.sendToNative(Constants.NativeSdkPaths.ClearCart);
            } else {
              mpInstance._SessionManager.resetSessionTimer();

              allProducts = mpInstance._Persistence.getAllUserProductsFromLS();

              if (allProducts && allProducts[mpid] && allProducts[mpid].cp) {
                allProducts[mpid].cp = [];
                allProducts[mpid].cp = [];

                mpInstance._Persistence.setCartProducts(allProducts);
              }
            }
          },

          /**
           * Returns all cart products
           * @method getCartProducts
           * @return {Array} array of cart products
           * @deprecated
           */
          getCartProducts: function getCartProducts() {
            mpInstance.Logger.warning('Deprecated function Identity.getCurrentUser().getCart().getCartProducts() will be removed in future releases');
            return mpInstance._Persistence.getCartProducts(mpid);
          }
        };
      };

      this.parseIdentityResponse = function (xhr, previousMPID, callback, identityApiData, method) {
        var prevUser = mpInstance.Identity.getUser(previousMPID),
            newUser,
            mpidIsNotInCookies,
            identityApiResult,
            indexOfMPID,
            newIdentitiesByType = {},
            previousUIByName = prevUser ? prevUser.getUserIdentities().userIdentities : {},
            previousUIByNameCopy = mpInstance._Helpers.extend({}, previousUIByName);

        mpInstance._Store.identityCallInFlight = false;

        try {
          mpInstance.Logger.verbose('Parsing "' + method + '" identity response from server');

          if (xhr.responseText) {
            identityApiResult = JSON.parse(xhr.responseText);

            if (identityApiResult.hasOwnProperty('is_logged_in')) {
              mpInstance._Store.isLoggedIn = identityApiResult.is_logged_in;
            }
          } // set currentUser


          if (!prevUser || prevUser.getMPID() && identityApiResult.mpid && identityApiResult.mpid !== prevUser.getMPID()) {
            mpInstance._Store.mpid = identityApiResult.mpid;

            if (prevUser) {
              mpInstance._Persistence.setLastSeenTime(previousMPID);
            }

            if (!mpInstance._Persistence.getFirstSeenTime(identityApiResult.mpid)) mpidIsNotInCookies = true;

            mpInstance._Persistence.setFirstSeenTime(identityApiResult.mpid);
          }

          if (xhr.status === 200) {
            if (method === 'modify') {
              newIdentitiesByType = mpInstance._Identity.IdentityRequest.combineUserIdentities(previousUIByName, identityApiData.userIdentities);

              mpInstance._Persistence.saveUserIdentitiesToPersistence(previousMPID, newIdentitiesByType);
            } else {
              var incomingUser = self.IdentityAPI.getUser(identityApiResult.mpid);
              var incomingMpidUIByName = incomingUser ? incomingUser.getUserIdentities().userIdentities : {};

              var incomingMpidUIByNameCopy = mpInstance._Helpers.extend({}, incomingMpidUIByName);

              mpInstance.Logger.verbose('Successfully parsed Identity Response'); //this covers an edge case where, users stored before "firstSeenTime" was introduced
              //will not have a value for "fst" until the current MPID changes, and in some cases,
              //the current MPID will never change

              if (method === 'identify' && prevUser && identityApiResult.mpid === prevUser.getMPID()) {
                mpInstance._Persistence.setFirstSeenTime(identityApiResult.mpid);
              }

              indexOfMPID = mpInstance._Store.currentSessionMPIDs.indexOf(identityApiResult.mpid);

              if (mpInstance._Store.sessionId && identityApiResult.mpid && previousMPID !== identityApiResult.mpid && indexOfMPID < 0) {
                mpInstance._Store.currentSessionMPIDs.push(identityApiResult.mpid);
              }

              if (indexOfMPID > -1) {
                mpInstance._Store.currentSessionMPIDs = mpInstance._Store.currentSessionMPIDs.slice(0, indexOfMPID).concat(mpInstance._Store.currentSessionMPIDs.slice(indexOfMPID + 1, mpInstance._Store.currentSessionMPIDs.length));

                mpInstance._Store.currentSessionMPIDs.push(identityApiResult.mpid);
              }

              mpInstance._CookieSyncManager.attemptCookieSync(previousMPID, identityApiResult.mpid, mpidIsNotInCookies);

              self.checkIdentitySwap(previousMPID, identityApiResult.mpid, mpInstance._Store.currentSessionMPIDs); //if there is any previous migration data

              if (Object.keys(mpInstance._Store.migrationData).length) {
                newIdentitiesByType = mpInstance._Store.migrationData.userIdentities || {};
                var userAttributes = mpInstance._Store.migrationData.userAttributes || {};

                mpInstance._Persistence.saveUserAttributesToPersistence(identityApiResult.mpid, userAttributes);
              } else {
                if (identityApiData && identityApiData.userIdentities && Object.keys(identityApiData.userIdentities).length) {
                  newIdentitiesByType = self.IdentityRequest.combineUserIdentities(incomingMpidUIByName, identityApiData.userIdentities);
                }
              }

              mpInstance._Persistence.saveUserIdentitiesToPersistence(identityApiResult.mpid, newIdentitiesByType);

              mpInstance._Persistence.update();

              mpInstance._Persistence.findPrevCookiesBasedOnUI(identityApiData);

              mpInstance._Store.context = identityApiResult.context || mpInstance._Store.context;
            }

            newUser = mpInstance.Identity.getCurrentUser();

            if (identityApiData && identityApiData.onUserAlias && mpInstance._Helpers.Validators.isFunction(identityApiData.onUserAlias)) {
              try {
                mpInstance.Logger.warning('Deprecated function onUserAlias will be removed in future releases');
                identityApiData.onUserAlias(prevUser, newUser);
              } catch (e) {
                mpInstance.Logger.error('There was an error with your onUserAlias function - ' + e);
              }
            }

            var persistence = mpInstance._Persistence.getPersistence();

            if (newUser) {
              mpInstance._Persistence.storeDataInMemory(persistence, newUser.getMPID());

              if (!prevUser || newUser.getMPID() !== prevUser.getMPID() || prevUser.isLoggedIn() !== newUser.isLoggedIn()) {
                mpInstance._Forwarders.initForwarders(newUser.getUserIdentities().userIdentities, mpInstance._APIClient.prepareForwardingStats);
              }

              mpInstance._Forwarders.setForwarderUserIdentities(newUser.getUserIdentities().userIdentities);

              mpInstance._Forwarders.setForwarderOnIdentityComplete(newUser, method);

              mpInstance._Forwarders.setForwarderOnUserIdentified(newUser, method);
            }

            var newIdentitiesByName = {};

            for (var key in newIdentitiesByType) {
              newIdentitiesByName[Types.IdentityType.getIdentityName(mpInstance._Helpers.parseNumber(key))] = newIdentitiesByType[key];
            }

            self.sendUserIdentityChangeEvent(newIdentitiesByName, method, identityApiResult.mpid, method === 'modify' ? previousUIByNameCopy : incomingMpidUIByNameCopy);
          }

          if (callback) {
            if (xhr.status === 0) {
              mpInstance._Helpers.invokeCallback(callback, HTTPCodes.noHttpCoverage, identityApiResult || null, newUser);
            } else {
              mpInstance._Helpers.invokeCallback(callback, xhr.status, identityApiResult || null, newUser);
            }
          } else {
            if (identityApiResult && identityApiResult.errors && identityApiResult.errors.length) {
              mpInstance.Logger.error('Received HTTP response code of ' + xhr.status + ' - ' + identityApiResult.errors[0].message);
            }
          }

          mpInstance._APIClient.processQueuedEvents();
        } catch (e) {
          if (callback) {
            mpInstance._Helpers.invokeCallback(callback, xhr.status, identityApiResult || null);
          }

          mpInstance.Logger.error('Error parsing JSON response from Identity server: ' + e);
        }
      }; // send a user identity change request on identify, login, logout, modify when any values change.
      // compare what identities exist vs what is previously was for the specific user if they were in memory before.
      // if it's the first time the user is logging in, send a user identity change request with


      this.sendUserIdentityChangeEvent = function (newUserIdentities, method, mpid, prevUserIdentities) {
        var currentUserInMemory, userIdentityChangeEvent;

        if (!mpInstance._APIClient.shouldEnableBatching()) {
          return;
        }

        if (!mpid) {
          if (method !== 'modify') {
            return;
          }
        }

        currentUserInMemory = this.IdentityAPI.getUser(mpid);

        for (var identityType in newUserIdentities) {
          if (prevUserIdentities[identityType] !== newUserIdentities[identityType]) {
            var isNewUserIdentityType = !prevUserIdentities[identityType];
            userIdentityChangeEvent = self.createUserIdentityChange(identityType, newUserIdentities[identityType], prevUserIdentities[identityType], isNewUserIdentityType, currentUserInMemory);

            mpInstance._APIClient.sendEventToServer(userIdentityChangeEvent);
          }
        }
      };

      this.createUserIdentityChange = function (identityType, newIdentity, oldIdentity, newCreatedThisBatch, userInMemory) {
        var userIdentityChangeEvent;
        userIdentityChangeEvent = mpInstance._ServerModel.createEventObject({
          messageType: Types.MessageType.UserIdentityChange,
          userIdentityChanges: {
            New: {
              IdentityType: identityType,
              Identity: newIdentity,
              CreatedThisBatch: newCreatedThisBatch
            },
            Old: {
              IdentityType: identityType,
              Identity: oldIdentity,
              CreatedThisBatch: false
            }
          },
          userInMemory: userInMemory
        });
        return userIdentityChangeEvent;
      };

      this.sendUserAttributeChangeEvent = function (attributeKey, newUserAttributeValue, previousUserAttributeValue, isNewAttribute, deleted, user) {
        if (!mpInstance._APIClient.shouldEnableBatching()) {
          return;
        }

        var userAttributeChangeEvent = self.createUserAttributeChange(attributeKey, newUserAttributeValue, previousUserAttributeValue, isNewAttribute, deleted, user);

        if (userAttributeChangeEvent) {
          mpInstance._APIClient.sendEventToServer(userAttributeChangeEvent);
        }
      };

      this.createUserAttributeChange = function (key, newValue, previousUserAttributeValue, isNewAttribute, deleted, user) {
        if (!previousUserAttributeValue) {
          previousUserAttributeValue = null;
        }

        var userAttributeChangeEvent;

        if (newValue !== previousUserAttributeValue) {
          userAttributeChangeEvent = mpInstance._ServerModel.createEventObject({
            messageType: Types.MessageType.UserAttributeChange,
            userAttributeChanges: {
              UserAttributeName: key,
              New: newValue,
              Old: previousUserAttributeValue || null,
              Deleted: deleted,
              IsNewAttribute: isNewAttribute
            }
          }, user);
        }

        return userAttributeChangeEvent;
      };
    }

    function Consent(mpInstance) {
      var self = this;
      var CCPAPurpose = 'data_sale_opt_out'; // this function is called when consent is required to determine if a cookie sync should happen, or a forwarder should be initialized

      this.isEnabledForUserConsent = function (consentRules, user) {
        if (!consentRules || !consentRules.values || !consentRules.values.length) {
          return true;
        }

        if (!user) {
          return false;
        }

        var purposeHashes = {},
            consentState = user.getConsentState(),
            purposeHash;

        if (consentState) {
          // the server hashes consent purposes in the following way:
          // GDPR - '1' + purpose name
          // CCPA - '2data_sale_opt_out' (there is only 1 purpose of data_sale_opt_out for CCPA)
          var GDPRConsentHashPrefix = '1';
          var CCPAPurpose = 'data_sale_opt_out';
          var CCPAHashString = '2' + CCPAPurpose;
          var gdprConsentState = consentState.getGDPRConsentState();

          if (gdprConsentState) {
            for (var purpose in gdprConsentState) {
              if (gdprConsentState.hasOwnProperty(purpose)) {
                purposeHash = mpInstance._Helpers.generateHash(GDPRConsentHashPrefix + purpose).toString();
                purposeHashes[purposeHash] = gdprConsentState[purpose].Consented;
              }
            }
          }

          var CCPAConsentState = consentState.getCCPAConsentState();

          if (CCPAConsentState) {
            purposeHash = mpInstance._Helpers.generateHash(CCPAHashString).toString();
            purposeHashes[purposeHash] = CCPAConsentState.Consented;
          }
        }

        var isMatch = consentRules.values.some(function (consentRule) {
          var consentPurposeHash = consentRule.consentPurpose;
          var hasConsented = consentRule.hasConsented;

          if (purposeHashes.hasOwnProperty(consentPurposeHash)) {
            return purposeHashes[consentPurposeHash] === hasConsented;
          }
        });
        return consentRules.includeOnMatch === isMatch;
      };

      this.createPrivacyConsent = function (consented, timestamp, consentDocument, location, hardwareId) {
        if (typeof consented !== 'boolean') {
          mpInstance.Logger.error('Consented boolean is required when constructing a Consent object.');
          return null;
        }

        if (timestamp && isNaN(timestamp)) {
          mpInstance.Logger.error('Timestamp must be a valid number when constructing a Consent object.');
          return null;
        }

        if (consentDocument && typeof consentDocument !== 'string') {
          mpInstance.Logger.error('Document must be a valid string when constructing a Consent object.');
          return null;
        }

        if (location && typeof location !== 'string') {
          mpInstance.Logger.error('Location must be a valid string when constructing a Consent object.');
          return null;
        }

        if (hardwareId && typeof hardwareId !== 'string') {
          mpInstance.Logger.error('Hardware ID must be a valid string when constructing a Consent object.');
          return null;
        }

        return {
          Consented: consented,
          Timestamp: timestamp || Date.now(),
          ConsentDocument: consentDocument,
          Location: location,
          HardwareId: hardwareId
        };
      };

      this.ConsentSerialization = {
        toMinifiedJsonObject: function toMinifiedJsonObject(state) {
          var jsonObject = {};

          if (state) {
            var gdprConsentState = state.getGDPRConsentState();

            if (gdprConsentState) {
              jsonObject.gdpr = {};

              for (var purpose in gdprConsentState) {
                if (gdprConsentState.hasOwnProperty(purpose)) {
                  var gdprConsent = gdprConsentState[purpose];
                  jsonObject.gdpr[purpose] = {};

                  if (typeof gdprConsent.Consented === 'boolean') {
                    jsonObject.gdpr[purpose].c = gdprConsent.Consented;
                  }

                  if (typeof gdprConsent.Timestamp === 'number') {
                    jsonObject.gdpr[purpose].ts = gdprConsent.Timestamp;
                  }

                  if (typeof gdprConsent.ConsentDocument === 'string') {
                    jsonObject.gdpr[purpose].d = gdprConsent.ConsentDocument;
                  }

                  if (typeof gdprConsent.Location === 'string') {
                    jsonObject.gdpr[purpose].l = gdprConsent.Location;
                  }

                  if (typeof gdprConsent.HardwareId === 'string') {
                    jsonObject.gdpr[purpose].h = gdprConsent.HardwareId;
                  }
                }
              }
            }

            var ccpaConsentState = state.getCCPAConsentState();

            if (ccpaConsentState) {
              jsonObject.ccpa = {};
              jsonObject.ccpa[CCPAPurpose] = {};

              if (typeof ccpaConsentState.Consented === 'boolean') {
                jsonObject.ccpa[CCPAPurpose].c = ccpaConsentState.Consented;
              }

              if (typeof ccpaConsentState.Timestamp === 'number') {
                jsonObject.ccpa[CCPAPurpose].ts = ccpaConsentState.Timestamp;
              }

              if (typeof ccpaConsentState.ConsentDocument === 'string') {
                jsonObject.ccpa[CCPAPurpose].d = ccpaConsentState.ConsentDocument;
              }

              if (typeof ccpaConsentState.Location === 'string') {
                jsonObject.ccpa[CCPAPurpose].l = ccpaConsentState.Location;
              }

              if (typeof ccpaConsentState.HardwareId === 'string') {
                jsonObject.ccpa[CCPAPurpose].h = ccpaConsentState.HardwareId;
              }
            }
          }

          return jsonObject;
        },
        fromMinifiedJsonObject: function fromMinifiedJsonObject(json) {
          var state = self.createConsentState();

          if (json.gdpr) {
            for (var purpose in json.gdpr) {
              if (json.gdpr.hasOwnProperty(purpose)) {
                var gdprConsent = self.createPrivacyConsent(json.gdpr[purpose].c, json.gdpr[purpose].ts, json.gdpr[purpose].d, json.gdpr[purpose].l, json.gdpr[purpose].h);
                state.addGDPRConsentState(purpose, gdprConsent);
              }
            }
          }

          if (json.ccpa) {
            if (json.ccpa.hasOwnProperty(CCPAPurpose)) {
              var ccpaConsent = self.createPrivacyConsent(json.ccpa[CCPAPurpose].c, json.ccpa[CCPAPurpose].ts, json.ccpa[CCPAPurpose].d, json.ccpa[CCPAPurpose].l, json.ccpa[CCPAPurpose].h);
              state.setCCPAConsentState(ccpaConsent);
            }
          }

          return state;
        }
      };

      this.createConsentState = function (consentState) {
        var gdpr = {};
        var ccpa = {};

        if (consentState) {
          setGDPRConsentState(consentState.getGDPRConsentState());
          setCCPAConsentState(consentState.getCCPAConsentState());
        }

        function canonicalizeForDeduplication(purpose) {
          if (typeof purpose !== 'string') {
            return null;
          }

          var trimmedPurpose = purpose.trim();

          if (!trimmedPurpose.length) {
            return null;
          }

          return trimmedPurpose.toLowerCase();
        }
        /**
         * Invoke these methods on a consent state object.
         * <p>
         * Usage: var consent = mParticle.Consent.createConsentState()
         * <br>
         * consent.setGDPRCoonsentState()
         *
         * @class Consent
         */

        /**
         * Add a GDPR Consent State to the consent state object
         *
         * @method addGDPRConsentState
         * @param purpose [String] Data processing purpose that describes the type of processing done on the data subject’s data
         * @param gdprConsent [Object] A GDPR consent object created via mParticle.Consent.createGDPRConsent(...)
         */


        function addGDPRConsentState(purpose, gdprConsent) {
          var normalizedPurpose = canonicalizeForDeduplication(purpose);

          if (!normalizedPurpose) {
            mpInstance.Logger.error('Purpose must be a string.');
            return this;
          }

          if (!mpInstance._Helpers.isObject(gdprConsent)) {
            mpInstance.Logger.error('Invoked with a bad or empty consent object.');
            return this;
          }

          var gdprConsentCopy = self.createPrivacyConsent(gdprConsent.Consented, gdprConsent.Timestamp, gdprConsent.ConsentDocument, gdprConsent.Location, gdprConsent.HardwareId);

          if (gdprConsentCopy) {
            gdpr[normalizedPurpose] = gdprConsentCopy;
          }

          return this;
        }

        function setGDPRConsentState(gdprConsentState) {
          if (!gdprConsentState) {
            gdpr = {};
          } else if (mpInstance._Helpers.isObject(gdprConsentState)) {
            gdpr = {};

            for (var purpose in gdprConsentState) {
              if (gdprConsentState.hasOwnProperty(purpose)) {
                addGDPRConsentState(purpose, gdprConsentState[purpose]);
              }
            }
          }

          return this;
        }
        /**
         * Remove a GDPR Consent State to the consent state object
         *
         * @method removeGDPRConsentState
         * @param purpose [String] Data processing purpose that describes the type of processing done on the data subject’s data
         */


        function removeGDPRConsentState(purpose) {
          var normalizedPurpose = canonicalizeForDeduplication(purpose);

          if (!normalizedPurpose) {
            return this;
          }

          delete gdpr[normalizedPurpose];
          return this;
        }
        /**
         * Gets the GDPR Consent State
         *
         * @method getGDPRConsentState
         * @return {Object} A GDPR Consent State
         */


        function getGDPRConsentState() {
          return mpInstance._Helpers.extend({}, gdpr);
        }
        /**
         * Sets a CCPA Consent state (has a single purpose of 'data_sale_opt_out')
         *
         * @method setCCPAConsentState
         * @param {Object} ccpaConsent CCPA Consent State
         */


        function setCCPAConsentState(ccpaConsent) {
          if (!mpInstance._Helpers.isObject(ccpaConsent)) {
            mpInstance.Logger.error('Invoked with a bad or empty CCPA consent object.');
            return this;
          }

          var ccpaConsentCopy = self.createPrivacyConsent(ccpaConsent.Consented, ccpaConsent.Timestamp, ccpaConsent.ConsentDocument, ccpaConsent.Location, ccpaConsent.HardwareId);

          if (ccpaConsentCopy) {
            ccpa[CCPAPurpose] = ccpaConsentCopy;
          }

          return this;
        }
        /**
         * Gets the CCPA Consent State
         *
         * @method getCCPAConsentStatensent
         * @return {Object} A CCPA Consent State
         */


        function getCCPAConsentState() {
          return ccpa[CCPAPurpose];
        }
        /**
         * Removes CCPA from the consent state object
         *
         * @method removeCCPAConsentState
         */


        function removeCCPAConsentState() {
          delete ccpa[CCPAPurpose];
          return this;
        }

        function removeCCPAState() {
          mpInstance.Logger.warning('removeCCPAState is deprecated and will be removed in a future release; use removeCCPAConsentState instead');
          return removeCCPAConsentState();
        }

        return {
          setGDPRConsentState: setGDPRConsentState,
          addGDPRConsentState: addGDPRConsentState,
          setCCPAConsentState: setCCPAConsentState,
          getCCPAConsentState: getCCPAConsentState,
          getGDPRConsentState: getGDPRConsentState,
          removeGDPRConsentState: removeGDPRConsentState,
          removeCCPAState: removeCCPAState,
          removeCCPAConsentState: removeCCPAConsentState
        };
      };
    }

    function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
            symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; });
        keys.push.apply(keys, symbols);
    } return keys; }
    function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); });
        }
        else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        }
        else {
            ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); });
        }
    } return target; }
    /*
        TODO: Including this as a workaround because attempting to import it from
        @mparticle/data-planning-models directly creates a build error.
     */
    var DataPlanMatchType = {
        ScreenView: "screen_view",
        CustomEvent: "custom_event",
        Commerce: "commerce",
        UserAttributes: "user_attributes",
        UserIdentities: "user_identities",
        ProductAction: "product_action",
        PromotionAction: "promotion_action",
        ProductImpression: "product_impression"
    };
    /*
        inspiration from https://github.com/mParticle/data-planning-node/blob/master/src/data_planning/data_plan_event_validator.ts
        but modified to only include commerce events, custom events, screen views, and removes validation

        The purpose of the KitBlocker class is to parse a data plan and determine what events, event/user/product attributes, and user identities should be blocked from downstream forwarders.

        KitBlocker is instantiated with a data plan on mParticle initialization. KitBlocker.kitBlockingEnabled is false if no data plan is passed.
        It parses the data plan by creating a `dataPlanMatchLookups` object in the following manner:
            1. For all events and user attributes/identities, it generates a `matchKey` in the shape of `typeOfEvent:eventType:nameOfEvent`
                a. The matchKeys' value will return `true` if additionalProperties for the custom attributes/identities is `true`, otherwise it will return an object of planned attribute/identities
            2. For commerce events, after step 1 and 1a, a second `matchKey` is included that appends `Products`. This is used to determine productAttributes blocked
        
        When an event is logged in mParticle, it is sent to our server and then calls `KitBlocker.createBlockedEvent` before passing the event to each forwarder.
        If the event is blocked, it will not send to the forwarder. If the event is not blocked, event/user/product attributes and user identities will be removed from the returned event if blocked.
    */
    var KitBlocker = /*#__PURE__*/ function () {
        function KitBlocker(dataPlan, mpInstance) {
            var _dataPlan$document, _dataPlan$document$dt, _dataPlan$document$dt2, _dataPlan$document2, _dataPlan$document2$d, _dataPlan$document2$d2, _dataPlan$document3, _dataPlan$document3$d, _dataPlan$document3$d2, _dataPlan$document4, _dataPlan$document4$d, _dataPlan$document4$d2, _dataPlan$document5, _dataPlan$document5$d, _dataPlan$document5$d2, _this = this;
            _classCallCheck(this, KitBlocker);
            _defineProperty(this, "dataPlanMatchLookups", {});
            _defineProperty(this, "blockEvents", false);
            _defineProperty(this, "blockEventAttributes", false);
            _defineProperty(this, "blockUserAttributes", false);
            _defineProperty(this, "blockUserIdentities", false);
            _defineProperty(this, "kitBlockingEnabled", false);
            _defineProperty(this, "mpInstance", void 0);
            // if data plan is not requested, the data plan is {document: null}
            if (dataPlan && !dataPlan.document) {
                this.kitBlockingEnabled = false;
                return;
            }
            this.kitBlockingEnabled = true;
            this.mpInstance = mpInstance;
            this.blockEvents = dataPlan === null || dataPlan === void 0 ? void 0 : (_dataPlan$document = dataPlan.document) === null || _dataPlan$document === void 0 ? void 0 : (_dataPlan$document$dt = _dataPlan$document.dtpn) === null || _dataPlan$document$dt === void 0 ? void 0 : (_dataPlan$document$dt2 = _dataPlan$document$dt.blok) === null || _dataPlan$document$dt2 === void 0 ? void 0 : _dataPlan$document$dt2.ev;
            this.blockEventAttributes = dataPlan === null || dataPlan === void 0 ? void 0 : (_dataPlan$document2 = dataPlan.document) === null || _dataPlan$document2 === void 0 ? void 0 : (_dataPlan$document2$d = _dataPlan$document2.dtpn) === null || _dataPlan$document2$d === void 0 ? void 0 : (_dataPlan$document2$d2 = _dataPlan$document2$d.blok) === null || _dataPlan$document2$d2 === void 0 ? void 0 : _dataPlan$document2$d2.ea;
            this.blockUserAttributes = dataPlan === null || dataPlan === void 0 ? void 0 : (_dataPlan$document3 = dataPlan.document) === null || _dataPlan$document3 === void 0 ? void 0 : (_dataPlan$document3$d = _dataPlan$document3.dtpn) === null || _dataPlan$document3$d === void 0 ? void 0 : (_dataPlan$document3$d2 = _dataPlan$document3$d.blok) === null || _dataPlan$document3$d2 === void 0 ? void 0 : _dataPlan$document3$d2.ua;
            this.blockUserIdentities = dataPlan === null || dataPlan === void 0 ? void 0 : (_dataPlan$document4 = dataPlan.document) === null || _dataPlan$document4 === void 0 ? void 0 : (_dataPlan$document4$d = _dataPlan$document4.dtpn) === null || _dataPlan$document4$d === void 0 ? void 0 : (_dataPlan$document4$d2 = _dataPlan$document4$d.blok) === null || _dataPlan$document4$d2 === void 0 ? void 0 : _dataPlan$document4$d2.id;
            var versionDocument = dataPlan === null || dataPlan === void 0 ? void 0 : (_dataPlan$document5 = dataPlan.document) === null || _dataPlan$document5 === void 0 ? void 0 : (_dataPlan$document5$d = _dataPlan$document5.dtpn) === null || _dataPlan$document5$d === void 0 ? void 0 : (_dataPlan$document5$d2 = _dataPlan$document5$d.vers) === null || _dataPlan$document5$d2 === void 0 ? void 0 : _dataPlan$document5$d2.version_document;
            var dataPoints = versionDocument === null || versionDocument === void 0 ? void 0 : versionDocument.data_points;
            if (versionDocument) {
                try {
                    if ((dataPoints === null || dataPoints === void 0 ? void 0 : dataPoints.length) > 0) {
                        dataPoints.forEach(function (point) {
                            return _this.addToMatchLookups(point);
                        });
                    }
                }
                catch (e) {
                    this.mpInstance.Logger.error('There was an issue with the data plan: ' + e);
                }
            }
        }
        _createClass(KitBlocker, [{
                key: "addToMatchLookups",
                value: function addToMatchLookups(point) {
                    var _point$match, _point$match2, _point$match3;
                    if (!point.match || !point.validator) {
                        this.mpInstance.Logger.warning("Data Plan Point is not valid' + ".concat(point));
                        return;
                    } // match keys for non product custom attribute related data points
                    var matchKey = this.generateMatchKey(point.match);
                    var properties = this.getPlannedProperties(point.match.type, point.validator);
                    this.dataPlanMatchLookups[matchKey] = properties; // match keys for product custom attribute related data points
                    if ((point === null || point === void 0 ? void 0 : (_point$match = point.match) === null || _point$match === void 0 ? void 0 : _point$match.type) === DataPlanMatchType.ProductImpression || (point === null || point === void 0 ? void 0 : (_point$match2 = point.match) === null || _point$match2 === void 0 ? void 0 : _point$match2.type) === DataPlanMatchType.ProductAction || (point === null || point === void 0 ? void 0 : (_point$match3 = point.match) === null || _point$match3 === void 0 ? void 0 : _point$match3.type) === DataPlanMatchType.PromotionAction) {
                        matchKey = this.generateProductAttributeMatchKey(point.match);
                        properties = this.getProductProperties(point.match.type, point.validator);
                        this.dataPlanMatchLookups[matchKey] = properties;
                    }
                }
            }, {
                key: "generateMatchKey",
                value: function generateMatchKey(match) {
                    var criteria = match.criteria || '';
                    switch (match.type) {
                        case DataPlanMatchType.CustomEvent:
                            var customEventCriteria = criteria;
                            return [DataPlanMatchType.CustomEvent, customEventCriteria.custom_event_type, customEventCriteria.event_name].join(':');
                        case DataPlanMatchType.ScreenView:
                            var screenViewCriteria = criteria;
                            return [DataPlanMatchType.ScreenView, '', screenViewCriteria.screen_name].join(':');
                        case DataPlanMatchType.ProductAction:
                            var productActionMatch = criteria;
                            return [match.type, productActionMatch.action].join(':');
                        case DataPlanMatchType.PromotionAction:
                            var promoActionMatch = criteria;
                            return [match.type, promoActionMatch.action].join(':');
                        case DataPlanMatchType.ProductImpression:
                            var productImpressionActionMatch = criteria;
                            return [match.type, productImpressionActionMatch.action].join(':');
                        case DataPlanMatchType.UserIdentities:
                        case DataPlanMatchType.UserAttributes:
                            return [match.type].join(':');
                        default:
                            return null;
                    }
                }
            }, {
                key: "generateProductAttributeMatchKey",
                value: function generateProductAttributeMatchKey(match) {
                    var criteria = match.criteria || '';
                    switch (match.type) {
                        case DataPlanMatchType.ProductAction:
                            var productActionMatch = criteria;
                            return [match.type, productActionMatch.action, 'ProductAttributes'].join(':');
                        case DataPlanMatchType.PromotionAction:
                            var promoActionMatch = criteria;
                            return [match.type, promoActionMatch.action, 'ProductAttributes'].join(':');
                        case DataPlanMatchType.ProductImpression:
                            return [match.type, 'ProductAttributes'].join(':');
                        default:
                            return null;
                    }
                }
            }, {
                key: "getPlannedProperties",
                value: function getPlannedProperties(type, validator) {
                    var _validator$definition, _validator$definition2, _validator$definition3, _validator$definition4, _validator$definition8;
                    var customAttributes;
                    var userAdditionalProperties;
                    switch (type) {
                        case DataPlanMatchType.CustomEvent:
                        case DataPlanMatchType.ScreenView:
                        case DataPlanMatchType.ProductAction:
                        case DataPlanMatchType.PromotionAction:
                        case DataPlanMatchType.ProductImpression:
                            customAttributes = validator === null || validator === void 0 ? void 0 : (_validator$definition = validator.definition) === null || _validator$definition === void 0 ? void 0 : (_validator$definition2 = _validator$definition.properties) === null || _validator$definition2 === void 0 ? void 0 : (_validator$definition3 = _validator$definition2.data) === null || _validator$definition3 === void 0 ? void 0 : (_validator$definition4 = _validator$definition3.properties) === null || _validator$definition4 === void 0 ? void 0 : _validator$definition4.custom_attributes;
                            if (customAttributes) {
                                if (customAttributes.additionalProperties === true || customAttributes.additionalProperties === undefined) {
                                    return true;
                                }
                                else {
                                    var properties = {};
                                    for (var _i = 0, _Object$keys = Object.keys(customAttributes.properties); _i < _Object$keys.length; _i++) {
                                        var property = _Object$keys[_i];
                                        properties[property] = true;
                                    }
                                    return properties;
                                }
                            }
                            else {
                                var _validator$definition5, _validator$definition6, _validator$definition7;
                                if ((validator === null || validator === void 0 ? void 0 : (_validator$definition5 = validator.definition) === null || _validator$definition5 === void 0 ? void 0 : (_validator$definition6 = _validator$definition5.properties) === null || _validator$definition6 === void 0 ? void 0 : (_validator$definition7 = _validator$definition6.data) === null || _validator$definition7 === void 0 ? void 0 : _validator$definition7.additionalProperties) === false) {
                                    return {};
                                }
                                else {
                                    return true;
                                }
                            }
                        case DataPlanMatchType.UserAttributes:
                        case DataPlanMatchType.UserIdentities:
                            userAdditionalProperties = validator === null || validator === void 0 ? void 0 : (_validator$definition8 = validator.definition) === null || _validator$definition8 === void 0 ? void 0 : _validator$definition8.additionalProperties;
                            if (userAdditionalProperties === true || userAdditionalProperties === undefined) {
                                return true;
                            }
                            else {
                                var _properties = {};
                                var userProperties = validator.definition.properties;
                                for (var _i2 = 0, _Object$keys2 = Object.keys(userProperties); _i2 < _Object$keys2.length; _i2++) {
                                    var _property = _Object$keys2[_i2];
                                    _properties[_property] = true;
                                }
                                return _properties;
                            }
                        default:
                            return null;
                    }
                }
            }, {
                key: "getProductProperties",
                value: function getProductProperties(type, validator) {
                    var _validator$definition9, _validator$definition10, _validator$definition11, _validator$definition12, _validator$definition13, _validator$definition14, _validator$definition15, _validator$definition16, _validator$definition17, _validator$definition18, _productCustomAttribu, _validator$definition19, _validator$definition20, _validator$definition21, _validator$definition22, _validator$definition23, _validator$definition24, _validator$definition25, _validator$definition26, _validator$definition27;
                    var productCustomAttributes;
                    switch (type) {
                        case DataPlanMatchType.ProductImpression:
                            productCustomAttributes = validator === null || validator === void 0 ? void 0 : (_validator$definition9 = validator.definition) === null || _validator$definition9 === void 0 ? void 0 : (_validator$definition10 = _validator$definition9.properties) === null || _validator$definition10 === void 0 ? void 0 : (_validator$definition11 = _validator$definition10.data) === null || _validator$definition11 === void 0 ? void 0 : (_validator$definition12 = _validator$definition11.properties) === null || _validator$definition12 === void 0 ? void 0 : (_validator$definition13 = _validator$definition12.product_impressions) === null || _validator$definition13 === void 0 ? void 0 : (_validator$definition14 = _validator$definition13.items) === null || _validator$definition14 === void 0 ? void 0 : (_validator$definition15 = _validator$definition14.properties) === null || _validator$definition15 === void 0 ? void 0 : (_validator$definition16 = _validator$definition15.products) === null || _validator$definition16 === void 0 ? void 0 : (_validator$definition17 = _validator$definition16.items) === null || _validator$definition17 === void 0 ? void 0 : (_validator$definition18 = _validator$definition17.properties) === null || _validator$definition18 === void 0 ? void 0 : _validator$definition18.custom_attributes; //product item attributes
                            if (((_productCustomAttribu = productCustomAttributes) === null || _productCustomAttribu === void 0 ? void 0 : _productCustomAttribu.additionalProperties) === false) {
                                var properties = {};
                                for (var _i3 = 0, _Object$keys3 = Object.keys((_productCustomAttribu2 = productCustomAttributes) === null || _productCustomAttribu2 === void 0 ? void 0 : _productCustomAttribu2.properties); _i3 < _Object$keys3.length; _i3++) {
                                    var _productCustomAttribu2;
                                    var property = _Object$keys3[_i3];
                                    properties[property] = true;
                                }
                                return properties;
                            }
                            return true;
                        case DataPlanMatchType.ProductAction:
                        case DataPlanMatchType.PromotionAction:
                            productCustomAttributes = validator === null || validator === void 0 ? void 0 : (_validator$definition19 = validator.definition) === null || _validator$definition19 === void 0 ? void 0 : (_validator$definition20 = _validator$definition19.properties) === null || _validator$definition20 === void 0 ? void 0 : (_validator$definition21 = _validator$definition20.data) === null || _validator$definition21 === void 0 ? void 0 : (_validator$definition22 = _validator$definition21.properties) === null || _validator$definition22 === void 0 ? void 0 : (_validator$definition23 = _validator$definition22.product_action) === null || _validator$definition23 === void 0 ? void 0 : (_validator$definition24 = _validator$definition23.properties) === null || _validator$definition24 === void 0 ? void 0 : (_validator$definition25 = _validator$definition24.products) === null || _validator$definition25 === void 0 ? void 0 : (_validator$definition26 = _validator$definition25.items) === null || _validator$definition26 === void 0 ? void 0 : (_validator$definition27 = _validator$definition26.properties) === null || _validator$definition27 === void 0 ? void 0 : _validator$definition27.custom_attributes; //product item attributes
                            if (productCustomAttributes) {
                                if (productCustomAttributes.additionalProperties === false) {
                                    var _properties2 = {};
                                    for (var _i4 = 0, _Object$keys4 = Object.keys((_productCustomAttribu3 = productCustomAttributes) === null || _productCustomAttribu3 === void 0 ? void 0 : _productCustomAttribu3.properties); _i4 < _Object$keys4.length; _i4++) {
                                        var _productCustomAttribu3;
                                        var _property2 = _Object$keys4[_i4];
                                        _properties2[_property2] = true;
                                    }
                                    return _properties2;
                                }
                            }
                            return true;
                        default:
                            return null;
                    }
                }
            }, {
                key: "getMatchKey",
                value: function getMatchKey(eventToMatch) {
                    switch (eventToMatch.event_type) {
                        case dist_14.screenView:
                            var screenViewEvent = eventToMatch;
                            if (screenViewEvent.data) {
                                return ['screen_view', '', screenViewEvent.data.screen_name].join(':');
                            }
                            return null;
                        case dist_14.commerceEvent:
                            var commerceEvent = eventToMatch;
                            var matchKey = [];
                            if (commerceEvent && commerceEvent.data) {
                                var _commerceEvent$data = commerceEvent.data, product_action = _commerceEvent$data.product_action, product_impressions = _commerceEvent$data.product_impressions, promotion_action = _commerceEvent$data.promotion_action;
                                if (product_action) {
                                    matchKey.push(DataPlanMatchType.ProductAction);
                                    matchKey.push(product_action.action);
                                }
                                else if (promotion_action) {
                                    matchKey.push(DataPlanMatchType.PromotionAction);
                                    matchKey.push(promotion_action.action);
                                }
                                else if (product_impressions) {
                                    matchKey.push(DataPlanMatchType.ProductImpression);
                                }
                            }
                            return matchKey.join(':');
                        case dist_14.customEvent:
                            var customEvent = eventToMatch;
                            if (customEvent.data) {
                                return ['custom_event', customEvent.data.custom_event_type, customEvent.data.event_name].join(':');
                            }
                            return null;
                        default:
                            return null;
                    }
                }
            }, {
                key: "getProductAttributeMatchKey",
                value: function getProductAttributeMatchKey(eventToMatch) {
                    switch (eventToMatch.event_type) {
                        case dist_14.commerceEvent:
                            var commerceEvent = eventToMatch;
                            var matchKey = [];
                            var _commerceEvent$data2 = commerceEvent.data, product_action = _commerceEvent$data2.product_action, product_impressions = _commerceEvent$data2.product_impressions, promotion_action = _commerceEvent$data2.promotion_action;
                            if (product_action) {
                                matchKey.push(DataPlanMatchType.ProductAction);
                                matchKey.push(product_action.action);
                                matchKey.push('ProductAttributes');
                            }
                            else if (promotion_action) {
                                matchKey.push(DataPlanMatchType.PromotionAction);
                                matchKey.push(promotion_action.action);
                                matchKey.push('ProductAttributes');
                            }
                            else if (product_impressions) {
                                matchKey.push(DataPlanMatchType.ProductImpression);
                                matchKey.push('ProductAttributes');
                            }
                            return matchKey.join(':');
                        default:
                            return null;
                    }
                }
            }, {
                key: "createBlockedEvent",
                value: function createBlockedEvent(event) {
                    /*
                        return a transformed event based on event/event attributes,
                        then product attributes if applicable, then user attributes,
                        then the user identities
                    */
                    try {
                        if (event) {
                            event = this.transformEventAndEventAttributes(event);
                        }
                        if (event && event.EventDataType === Types.MessageType.Commerce) {
                            event = this.transformProductAttributes(event);
                        }
                        if (event) {
                            event = this.transformUserAttributes(event);
                            event = this.transformUserIdentities(event);
                        }
                        return event;
                    }
                    catch (e) {
                        return event;
                    }
                }
            }, {
                key: "transformEventAndEventAttributes",
                value: function transformEventAndEventAttributes(event) {
                    var clonedEvent = _objectSpread$1({}, event);
                    var baseEvent = convertEvent(clonedEvent);
                    var matchKey = this.getMatchKey(baseEvent);
                    var matchedEvent = this.dataPlanMatchLookups[matchKey];
                    if (this.blockEvents) {
                        /*
                            If the event is not planned, it doesn't exist in dataPlanMatchLookups
                            and should be blocked (return null to not send anything to forwarders)
                        */
                        if (!matchedEvent) {
                            return null;
                        }
                    }
                    if (this.blockEventAttributes) {
                        /*
                            matchedEvent is set to `true` if additionalProperties is `true`
                            otherwise, delete attributes that exist on event.EventAttributes
                            that aren't on
                        */
                        if (matchedEvent === true) {
                            return clonedEvent;
                        }
                        if (matchedEvent) {
                            for (var _i5 = 0, _Object$keys5 = Object.keys(clonedEvent.EventAttributes); _i5 < _Object$keys5.length; _i5++) {
                                var _key = _Object$keys5[_i5];
                                if (!matchedEvent[_key]) {
                                    delete clonedEvent.EventAttributes[_key];
                                }
                            }
                            return clonedEvent;
                        }
                        else {
                            return clonedEvent;
                        }
                    }
                    return clonedEvent;
                }
            }, {
                key: "transformProductAttributes",
                value: function transformProductAttributes(event) {
                    var _clonedEvent$ProductA;
                    var clonedEvent = _objectSpread$1({}, event);
                    var baseEvent = convertEvent(clonedEvent);
                    var matchKey = this.getProductAttributeMatchKey(baseEvent);
                    var matchedEvent = this.dataPlanMatchLookups[matchKey];
                    function removeAttribute(matchedEvent, productList) {
                        productList.forEach(function (product) {
                            for (var _i6 = 0, _Object$keys6 = Object.keys(product.Attributes); _i6 < _Object$keys6.length; _i6++) {
                                var productKey = _Object$keys6[_i6];
                                if (!matchedEvent[productKey]) {
                                    delete product.Attributes[productKey];
                                }
                            }
                        });
                    }
                    if (this.blockEvents) {
                        /*
                            If the event is not planned, it doesn't exist in dataPlanMatchLookups
                            and should be blocked (return null to not send anything to forwarders)
                        */
                        if (!matchedEvent) {
                            return null;
                        }
                    }
                    if (this.blockEventAttributes) {
                        /*
                            matchedEvent is set to `true` if additionalProperties is `true`
                            otherwise, delete attributes that exist on event.EventAttributes
                            that aren't on
                        */
                        if (matchedEvent === true) {
                            return clonedEvent;
                        }
                        if (matchedEvent) {
                            switch (event.EventCategory) {
                                case Types.CommerceEventType.ProductImpression:
                                    clonedEvent.ProductImpressions.forEach(function (impression) {
                                        removeAttribute(matchedEvent, impression === null || impression === void 0 ? void 0 : impression.ProductList);
                                    });
                                    break;
                                case Types.CommerceEventType.ProductPurchase:
                                    removeAttribute(matchedEvent, (_clonedEvent$ProductA = clonedEvent.ProductAction) === null || _clonedEvent$ProductA === void 0 ? void 0 : _clonedEvent$ProductA.ProductList);
                                    break;
                                default:
                                    this.mpInstance.Logger.warning('Product Not Supported ');
                            }
                            return clonedEvent;
                        }
                        else {
                            return clonedEvent;
                        }
                    }
                    return clonedEvent;
                }
            }, {
                key: "transformUserAttributes",
                value: function transformUserAttributes(event) {
                    var clonedEvent = _objectSpread$1({}, event);
                    if (this.blockUserAttributes) {
                        /*
                            If the user attribute is not found in the matchedAttributes
                            then remove it from event.UserAttributes as it is blocked
                        */
                        var matchedAttributes = this.dataPlanMatchLookups['user_attributes'];
                        if (this.mpInstance._Helpers.isObject(matchedAttributes)) {
                            for (var _i7 = 0, _Object$keys7 = Object.keys(clonedEvent.UserAttributes); _i7 < _Object$keys7.length; _i7++) {
                                var ua = _Object$keys7[_i7];
                                if (!matchedAttributes[ua]) {
                                    delete clonedEvent.UserAttributes[ua];
                                }
                            }
                        }
                    }
                    return clonedEvent;
                }
            }, {
                key: "isAttributeKeyBlocked",
                value: function isAttributeKeyBlocked(key) {
                    /* used when an attribute is added to the user */
                    if (!this.blockUserAttributes) {
                        return false;
                    }
                    if (this.blockUserAttributes) {
                        var matchedAttributes = this.dataPlanMatchLookups['user_attributes'];
                        if (matchedAttributes === true) {
                            return false;
                        }
                        if (!matchedAttributes[key]) {
                            return true;
                        }
                    }
                    return false;
                }
            }, {
                key: "isIdentityBlocked",
                value: function isIdentityBlocked(key) {
                    /* used when an attribute is added to the user */
                    if (!this.blockUserIdentities) {
                        return false;
                    }
                    if (this.blockUserIdentities) {
                        var matchedIdentities = this.dataPlanMatchLookups['user_identities'];
                        if (matchedIdentities === true) {
                            return false;
                        }
                        if (!matchedIdentities[key]) {
                            return true;
                        }
                    }
                    else {
                        return false;
                    }
                    return false;
                }
            }, {
                key: "transformUserIdentities",
                value: function transformUserIdentities(event) {
                    var _this2 = this;
                    /*
                        If the user identity is not found in matchedIdentities
                        then remove it from event.UserIdentities as it is blocked.
                        event.UserIdentities is of type [{Identity: 'id1', Type: 7}, ...]
                        and so to compare properly in matchedIdentities, each Type needs
                        to be converted to an identityName
                    */
                    var clonedEvent = _objectSpread$1({}, event);
                    if (this.blockUserIdentities) {
                        var matchedIdentities = this.dataPlanMatchLookups['user_identities'];
                        if (this.mpInstance._Helpers.isObject(matchedIdentities)) {
                            var _clonedEvent$UserIden;
                            if (clonedEvent !== null && clonedEvent !== void 0 && (_clonedEvent$UserIden = clonedEvent.UserIdentities) !== null && _clonedEvent$UserIden !== void 0 && _clonedEvent$UserIden.length) {
                                clonedEvent.UserIdentities.forEach(function (uiByType, i) {
                                    var identityName = Types.IdentityType.getIdentityName(_this2.mpInstance._Helpers.parseNumber(uiByType.Type));
                                    if (!matchedIdentities[identityName]) {
                                        clonedEvent.UserIdentities.splice(i, 1);
                                    }
                                });
                            }
                        }
                    }
                    return clonedEvent;
                }
            }]);
        return KitBlocker;
    }();

    function ConfigAPIClient() {
      this.getSDKConfiguration = function (apiKey, config, completeSDKInitialization, mpInstance) {
        var url;

        try {
          var xhrCallback = function xhrCallback() {
            if (xhr.readyState === 4) {
              // when a 200 returns, merge current config with what comes back from config, prioritizing user inputted config
              if (xhr.status === 200) {
                config = mpInstance._Helpers.extend({}, config, JSON.parse(xhr.responseText));
                completeSDKInitialization(apiKey, config, mpInstance);
                mpInstance.Logger.verbose('Successfully received configuration from server');
              } else {
                // if for some reason a 200 doesn't return, then we initialize with the just the passed through config
                completeSDKInitialization(apiKey, config, mpInstance);
                mpInstance.Logger.verbose('Issue with receiving configuration from server, received HTTP Code of ' + xhr.status);
              }
            }
          };

          var xhr = mpInstance._Helpers.createXHR(xhrCallback);

          url = 'https://' + mpInstance._Store.SDKConfig.configUrl + apiKey + '/config?env=';

          if (config.isDevelopmentMode) {
            url = url + '1';
          } else {
            url = url + '0';
          }

          var dataPlan = config.dataPlan;

          if (dataPlan) {
            if (dataPlan.planId) {
              url = url + '&plan_id=' + dataPlan.planId || '';
            }

            if (dataPlan.planVersion) {
              url = url + '&plan_version=' + dataPlan.planVersion || '';
            }
          }

          if (xhr) {
            xhr.open('get', url);
            xhr.send(null);
          }
        } catch (e) {
          completeSDKInitialization(apiKey, config, mpInstance);
          mpInstance.Logger.error('Error getting forwarder configuration from mParticle servers.');
        }
      };
    }

    var HTTPCodes$1 = Constants.HTTPCodes,
        Messages$8 = Constants.Messages;
    function IdentityAPIClient(mpInstance) {
      this.sendAliasRequest = function (aliasRequest, callback) {
        var xhr,
            xhrCallback = function xhrCallback() {
          if (xhr.readyState === 4) {
            mpInstance.Logger.verbose('Received ' + xhr.statusText + ' from server'); //only parse error messages from failing requests

            if (xhr.status !== 200 && xhr.status !== 202) {
              if (xhr.responseText) {
                var response = JSON.parse(xhr.responseText);

                if (response.hasOwnProperty('message')) {
                  var errorMessage = response.message;

                  mpInstance._Helpers.invokeAliasCallback(callback, xhr.status, errorMessage);

                  return;
                }
              }
            }

            mpInstance._Helpers.invokeAliasCallback(callback, xhr.status);
          }
        };

        mpInstance.Logger.verbose(Messages$8.InformationMessages.SendAliasHttp);
        xhr = mpInstance._Helpers.createXHR(xhrCallback);

        if (xhr) {
          try {
            xhr.open('post', mpInstance._Helpers.createServiceUrl(mpInstance._Store.SDKConfig.aliasUrl, mpInstance._Store.devToken) + '/Alias');
            xhr.send(JSON.stringify(aliasRequest));
          } catch (e) {
            mpInstance._Helpers.invokeAliasCallback(callback, HTTPCodes$1.noHttpCoverage, e);

            mpInstance.Logger.error('Error sending alias request to mParticle servers. ' + e);
          }
        }
      };

      this.sendIdentityRequest = function (identityApiRequest, method, callback, originalIdentityApiData, parseIdentityResponse, mpid) {
        var xhr,
            previousMPID,
            xhrCallback = function xhrCallback() {
          if (xhr.readyState === 4) {
            mpInstance.Logger.verbose('Received ' + xhr.statusText + ' from server');
            parseIdentityResponse(xhr, previousMPID, callback, originalIdentityApiData, method);
          }
        };

        mpInstance.Logger.verbose(Messages$8.InformationMessages.SendIdentityBegin);

        if (!identityApiRequest) {
          mpInstance.Logger.error(Messages$8.ErrorMessages.APIRequestEmpty);
          return;
        }

        mpInstance.Logger.verbose(Messages$8.InformationMessages.SendIdentityHttp);
        xhr = mpInstance._Helpers.createXHR(xhrCallback);

        if (xhr) {
          try {
            if (mpInstance._Store.identityCallInFlight) {
              mpInstance._Helpers.invokeCallback(callback, HTTPCodes$1.activeIdentityRequest, 'There is currently an Identity request processing. Please wait for this to return before requesting again');
            } else {
              previousMPID = mpid || null;

              if (method === 'modify') {
                xhr.open('post', mpInstance._Helpers.createServiceUrl(mpInstance._Store.SDKConfig.identityUrl) + mpid + '/' + method);
              } else {
                xhr.open('post', mpInstance._Helpers.createServiceUrl(mpInstance._Store.SDKConfig.identityUrl) + method);
              }

              xhr.setRequestHeader('Content-Type', 'application/json');
              xhr.setRequestHeader('x-mp-key', mpInstance._Store.devToken);
              mpInstance._Store.identityCallInFlight = true;
              xhr.send(JSON.stringify(identityApiRequest));
            }
          } catch (e) {
            mpInstance._Store.identityCallInFlight = false;

            mpInstance._Helpers.invokeCallback(callback, HTTPCodes$1.noHttpCoverage, e);

            mpInstance.Logger.error('Error sending identity request to servers with status code ' + xhr.status + ' - ' + e);
          }
        }
      };
    }

    var Messages$9 = Constants.Messages,
        HTTPCodes$2 = Constants.HTTPCodes;
    /**
     * <p>All of the following methods can be called on the primary mParticle class. In version 2.10.0, we introduced <a href="https://docs.mparticle.com/developers/sdk/web/multiple-instances/">multiple instances</a>. If you are using multiple instances (self hosted environments only), you should call these methods on each instance.</p>
     * <p>In current versions of mParticle, if your site has one instance, that instance name is 'default_instance'. Any methods called on mParticle on a site with one instance will be mapped to the `default_instance`.</p>
     * <p>This is for simplicity and backwards compatibility. For example, calling mParticle.logPageView() automatically maps to mParticle.getInstance('default_instance').logPageView().</p>
     * <p>If you have multiple instances, instances must first be initialized and then a method can be called on that instance. For example:</p>
     * <code>
     *  mParticle.init('apiKey', config, 'another_instance');
     *  mParticle.getInstance('another_instance').logPageView();
     * </code>
     *
     * @class mParticle & mParticleInstance
     */

    function mParticleInstance(instanceName) {
      var self = this; // These classes are for internal use only. Not documented for public consumption

      this._instanceName = instanceName;
      this._NativeSdkHelpers = new NativeSdkHelpers(this);
      this._Migrations = new Migrations(this);
      this._SessionManager = new SessionManager(this);
      this._Persistence = new _Persistence(this);
      this._Helpers = new Helpers(this);
      this._Events = new Events(this);
      this._CookieSyncManager = new cookieSyncManager(this);
      this._ServerModel = new ServerModel(this);
      this._Ecommerce = new Ecommerce(this);
      this._ForwardingStatsUploader = new forwardingStatsUploader(this);
      this._Consent = new Consent(this);
      this._IdentityAPIClient = new IdentityAPIClient(this);
      this._preInit = {
        readyQueue: [],
        integrationDelays: {},
        forwarderConstructors: []
      }; // required for forwarders once they reference the mparticle instance

      this.IdentityType = Types.IdentityType;
      this.EventType = Types.EventType;
      this.CommerceEventType = Types.CommerceEventType;
      this.PromotionType = Types.PromotionActionType;
      this.ProductActionType = Types.ProductActionType;
      this._Identity = new Identity(this);
      this.Identity = this._Identity.IdentityAPI;
      this.generateHash = this._Helpers.generateHash;
      this.getDeviceId = this._Persistence.getDeviceId;

      if (typeof window !== 'undefined') {
        if (window.mParticle && window.mParticle.config) {
          if (window.mParticle.config.hasOwnProperty('rq')) {
            this._preInit.readyQueue = window.mParticle.config.rq;
          }
        }
      }

      this.init = function (apiKey, config) {
        if (!config) {
          console.warn('You did not pass a config object to init(). mParticle will not initialize properly');
        }

        runPreConfigFetchInitialization(this, apiKey, config); // config code - Fetch config when requestConfig = true, otherwise, proceed with SDKInitialization
        // Since fetching the configuration is asynchronous, we must pass completeSDKInitialization
        // to it for it to be run after fetched

        if (config) {
          if (!config.hasOwnProperty('requestConfig') || config.requestConfig) {
            new ConfigAPIClient().getSDKConfiguration(apiKey, config, completeSDKInitialization, this);
          } else {
            completeSDKInitialization(apiKey, config, this);
          }
        } else {
          console.error('No config available on the window, please pass a config object to mParticle.init()');
          return;
        }
      };
      /**
       * Resets the SDK to an uninitialized state and removes cookies/localStorage. You MUST call mParticle.init(apiKey, window.mParticle.config)
       * before any other mParticle methods or the SDK will not function as intended.
       * @method setLogLevel
       * @param {String} logLevel verbose, warning, or none. By default, `warning` is chosen.
       */


      this.setLogLevel = function (newLogLevel) {
        self.Logger.setLogLevel(newLogLevel);
      };
      /**
       * Resets the SDK to an uninitialized state and removes cookies/localStorage. You MUST call mParticle.init(apiKey, window.mParticle.config)
       * before any other mParticle methods or the SDK will not function as intended.
       * @method reset
       */


      this.reset = function (instance) {
        instance._Persistence.resetPersistence();

        if (instance._Store) {
          delete instance._Store;
        }
      };

      this._resetForTests = function (config, keepPersistence, instance) {
        if (instance._Store) {
          delete instance._Store;
        }

        instance._Store = new Store(config, instance);
        instance._Store.isLocalStorageAvailable = instance._Persistence.determineLocalStorageAvailability(window.localStorage);

        instance._Events.stopTracking();

        if (!keepPersistence) {
          instance._Persistence.resetPersistence();
        }

        instance._Persistence.forwardingStatsBatches.uploadsTable = {};
        instance._Persistence.forwardingStatsBatches.forwardingStatsEventQueue = [];
        instance._preInit = {
          readyQueue: [],
          pixelConfigurations: [],
          integrationDelays: {},
          forwarderConstructors: [],
          isDevelopmentMode: false
        };
      };
      /**
       * A callback method that is invoked after mParticle is initialized.
       * @method ready
       * @param {Function} function A function to be called after mParticle is initialized
       */


      this.ready = function (f) {
        if (self._Store.isInitialized && typeof f === 'function') {
          f();
        } else {
          self._preInit.readyQueue.push(f);
        }
      };
      /**
       * Returns the mParticle SDK version number
       * @method getVersion
       * @return {String} mParticle SDK version number
       */


      this.getVersion = function () {
        return Constants.sdkVersion;
      };
      /**
       * Sets the app version
       * @method setAppVersion
       * @param {String} version version number
       */


      this.setAppVersion = function (version) {
        self._Store.SDKConfig.appVersion = version;

        self._Persistence.update();
      };
      /**
       * Gets the app name
       * @method getAppName
       * @return {String} App name
       */


      this.getAppName = function () {
        return self._Store.SDKConfig.appName;
      };
      /**
       * Sets the app name
       * @method setAppName
       * @param {String} name App Name
       */


      this.setAppName = function (name) {
        self._Store.SDKConfig.appName = name;
      };
      /**
       * Gets the app version
       * @method getAppVersion
       * @return {String} App version
       */


      this.getAppVersion = function () {
        return self._Store.SDKConfig.appVersion;
      };
      /**
       * Stops tracking the location of the user
       * @method stopTrackingLocation
       */


      this.stopTrackingLocation = function () {
        self._SessionManager.resetSessionTimer();

        self._Events.stopTracking();
      };
      /**
       * Starts tracking the location of the user
       * @method startTrackingLocation
       * @param {Function} [callback] A callback function that is called when the location is either allowed or rejected by the user. A position object of schema {coords: {latitude: number, longitude: number}} is passed to the callback
       */


      this.startTrackingLocation = function (callback) {
        if (!self._Helpers.Validators.isFunction(callback)) {
          self.Logger.warning('Warning: Location tracking is triggered, but not including a callback into the `startTrackingLocation` may result in events logged too quickly and not being associated with a location.');
        }

        self._SessionManager.resetSessionTimer();

        self._Events.startTracking(callback);
      };
      /**
       * Sets the position of the user
       * @method setPosition
       * @param {Number} lattitude lattitude digit
       * @param {Number} longitude longitude digit
       */


      this.setPosition = function (lat, lng) {
        self._SessionManager.resetSessionTimer();

        if (typeof lat === 'number' && typeof lng === 'number') {
          self._Store.currentPosition = {
            lat: lat,
            lng: lng
          };
        } else {
          self.Logger.error('Position latitude and/or longitude must both be of type number');
        }
      };
      /**
       * Starts a new session
       * @method startNewSession
       */


      this.startNewSession = function () {
        self._SessionManager.startNewSession();
      };
      /**
       * Ends the current session
       * @method endSession
       */


      this.endSession = function () {
        // Sends true as an over ride vs when endSession is called from the setInterval
        self._SessionManager.endSession(true);
      };
      /**
       * Logs a Base Event to mParticle's servers
       * @param {Object} event Base Event Object
       */


      this.logBaseEvent = function (event) {
        if (!self._Store.isInitialized) {
          self.ready(function () {
            self.logBaseEvent(event);
          });
          return;
        }

        self._SessionManager.resetSessionTimer();

        if (typeof event.name !== 'string') {
          self.Logger.error(Messages$9.ErrorMessages.EventNameInvalidType);
          return;
        }

        if (!event.eventType) {
          event.eventType = Types.EventType.Unknown;
        }

        if (!self._Helpers.canLog()) {
          self.Logger.error(Messages$9.ErrorMessages.LoggingDisabled);
          return;
        }

        self._Events.logEvent(event);
      };
      /**
       * Logs an event to mParticle's servers
       * @method logEvent
       * @param {String} eventName The name of the event
       * @param {Number} [eventType] The eventType as seen [here](http://docs.mparticle.com/developers/sdk/web/event-tracking#event-type)
       * @param {Object} [eventInfo] Attributes for the event
       * @param {Object} [customFlags] Additional customFlags
       */


      this.logEvent = function (eventName, eventType, eventInfo, customFlags) {
        if (!self._Store.isInitialized) {
          self.ready(function () {
            self.logEvent(eventName, eventType, eventInfo, customFlags);
          });
          return;
        }

        self._SessionManager.resetSessionTimer();

        if (typeof eventName !== 'string') {
          self.Logger.error(Messages$9.ErrorMessages.EventNameInvalidType);
          return;
        }

        if (!eventType) {
          eventType = Types.EventType.Unknown;
        }

        if (!self._Helpers.isEventType(eventType)) {
          self.Logger.error('Invalid event type: ' + eventType + ', must be one of: \n' + JSON.stringify(Types.EventType));
          return;
        }

        if (!self._Helpers.canLog()) {
          self.Logger.error(Messages$9.ErrorMessages.LoggingDisabled);
          return;
        }

        self._Events.logEvent({
          messageType: Types.MessageType.PageEvent,
          name: eventName,
          data: eventInfo,
          eventType: eventType,
          customFlags: customFlags
        });
      };
      /**
       * Used to log custom errors
       *
       * @method logError
       * @param {String or Object} error The name of the error (string), or an object formed as follows {name: 'exampleName', message: 'exampleMessage', stack: 'exampleStack'}
       * @param {Object} [attrs] Custom attrs to be passed along with the error event; values must be string, number, or boolean
       */


      this.logError = function (error, attrs) {
        if (!self._Store.isInitialized) {
          self.ready(function () {
            self.logError(error, attrs);
          });
          return;
        }

        self._SessionManager.resetSessionTimer();

        if (!error) {
          return;
        }

        if (typeof error === 'string') {
          error = {
            message: error
          };
        }

        var data = {
          m: error.message ? error.message : error,
          s: 'Error',
          t: error.stack || null
        };

        if (attrs) {
          var sanitized = self._Helpers.sanitizeAttributes(attrs, data.m);

          for (var prop in sanitized) {
            data[prop] = sanitized[prop];
          }
        }

        self._Events.logEvent({
          messageType: Types.MessageType.CrashReport,
          name: error.name ? error.name : 'Error',
          data: data,
          eventType: Types.EventType.Other
        });
      };
      /**
       * Logs `click` events
       * @method logLink
       * @param {String} selector The selector to add a 'click' event to (ex. #purchase-event)
       * @param {String} [eventName] The name of the event
       * @param {Number} [eventType] The eventType as seen [here](http://docs.mparticle.com/developers/sdk/javascript/event-tracking#event-type)
       * @param {Object} [eventInfo] Attributes for the event
       */


      this.logLink = function (selector, eventName, eventType, eventInfo) {
        self._Events.addEventHandler('click', selector, eventName, eventInfo, eventType);
      };
      /**
       * Logs `submit` events
       * @method logForm
       * @param {String} selector The selector to add the event handler to (ex. #search-event)
       * @param {String} [eventName] The name of the event
       * @param {Number} [eventType] The eventType as seen [here](http://docs.mparticle.com/developers/sdk/javascript/event-tracking#event-type)
       * @param {Object} [eventInfo] Attributes for the event
       */


      this.logForm = function (selector, eventName, eventType, eventInfo) {
        self._Events.addEventHandler('submit', selector, eventName, eventInfo, eventType);
      };
      /**
       * Logs a page view
       * @method logPageView
       * @param {String} eventName The name of the event. Defaults to 'PageView'.
       * @param {Object} [attrs] Attributes for the event
       * @param {Object} [customFlags] Custom flags for the event
       */


      this.logPageView = function (eventName, attrs, customFlags) {
        if (!self._Store.isInitialized) {
          self.ready(function () {
            self.logPageView(eventName, attrs, customFlags);
          });
          return;
        }

        self._SessionManager.resetSessionTimer();

        if (self._Helpers.canLog()) {
          if (!self._Helpers.Validators.isStringOrNumber(eventName)) {
            eventName = 'PageView';
          }

          if (!attrs) {
            attrs = {
              hostname: window.location.hostname,
              title: window.document.title
            };
          } else if (!self._Helpers.isObject(attrs)) {
            self.Logger.error('The attributes argument must be an object. A ' + _typeof(attrs) + ' was entered. Please correct and retry.');
            return;
          }

          if (customFlags && !self._Helpers.isObject(customFlags)) {
            self.Logger.error('The customFlags argument must be an object. A ' + _typeof(customFlags) + ' was entered. Please correct and retry.');
            return;
          }
        }

        self._Events.logEvent({
          messageType: Types.MessageType.PageView,
          name: eventName,
          data: attrs,
          eventType: Types.EventType.Unknown,
          customFlags: customFlags
        });
      };
      /**
       * Forces an upload of the batch
       * @method upload
       */


      this.upload = function () {
        if (self._Helpers.canLog()) {
          if (self._Store.webviewBridgeEnabled) {
            self._NativeSdkHelpers.sendToNative(Constants.NativeSdkPaths.Upload);
          } else {
            self._APIClient.uploader.prepareAndUpload(false, false);
          }
        }
      };
      /**
       * Invoke these methods on the mParticle.Consent object.
       * Example: mParticle.Consent.createConsentState()
       *
       * @class mParticle.Consent
       */


      this.Consent = {
        /**
         * Creates a CCPA Opt Out Consent State.
         *
         * @method createCCPAConsent
         * @param {Boolean} optOut true represents a "data sale opt-out", false represents the user declining a "data sale opt-out"
         * @param {Number} timestamp Unix time (likely to be Date.now())
         * @param {String} consentDocument document version or experience that the user may have consented to
         * @param {String} location location where the user gave consent
         * @param {String} hardwareId hardware ID for the device or browser used to give consent. This property exists only to provide additional context and is not used to identify users
         * @return {Object} CCPA Consent State
         */
        createCCPAConsent: self._Consent.createPrivacyConsent,

        /**
         * Creates a GDPR Consent State.
         *
         * @method createGDPRConsent
         * @param {Boolean} consent true represents a "data sale opt-out", false represents the user declining a "data sale opt-out"
         * @param {Number} timestamp Unix time (likely to be Date.now())
         * @param {String} consentDocument document version or experience that the user may have consented to
         * @param {String} location location where the user gave consent
         * @param {String} hardwareId hardware ID for the device or browser used to give consent. This property exists only to provide additional context and is not used to identify users
         * @return {Object} GDPR Consent State
         */
        createGDPRConsent: self._Consent.createPrivacyConsent,

        /**
         * Creates a Consent State Object, which can then be used to set CCPA states, add multiple GDPR states, as well as get and remove these privacy states.
         *
         * @method createConsentState
         * @return {Object} ConsentState object
         */
        createConsentState: self._Consent.createConsentState
      };
      /**
       * Invoke these methods on the mParticle.eCommerce object.
       * Example: mParticle.eCommerce.createImpresion(...)
       * @class mParticle.eCommerce
       */

      this.eCommerce = {
        /**
         * Invoke these methods on the mParticle.eCommerce.Cart object.
         * Example: mParticle.eCommerce.Cart.add(...)
         * @class mParticle.eCommerce.Cart
         * @deprecated
         */
        Cart: {
          /**
           * Adds a product to the cart
           * @method add
           * @param {Object} product The product you want to add to the cart
           * @param {Boolean} [logEventBoolean] Option to log the event to mParticle's servers. If blank, no logging occurs.
           * @deprecated
           */
          add: function add(product, logEventBoolean) {
            self.Logger.warning('Deprecated function eCommerce.Cart.add() will be removed in future releases');
            var mpid,
                currentUser = self.Identity.getCurrentUser();

            if (currentUser) {
              mpid = currentUser.getMPID();
            }

            self._Identity.mParticleUserCart(mpid).add(product, logEventBoolean);
          },

          /**
           * Removes a product from the cart
           * @method remove
           * @param {Object} product The product you want to add to the cart
           * @param {Boolean} [logEventBoolean] Option to log the event to mParticle's servers. If blank, no logging occurs.
           * @deprecated
           */
          remove: function remove(product, logEventBoolean) {
            self.Logger.warning('Deprecated function eCommerce.Cart.remove() will be removed in future releases');
            var mpid,
                currentUser = self.Identity.getCurrentUser();

            if (currentUser) {
              mpid = currentUser.getMPID();
            }

            self._Identity.mParticleUserCart(mpid).remove(product, logEventBoolean);
          },

          /**
           * Clears the cart
           * @method clear
           * @deprecated
           */
          clear: function clear() {
            self.Logger.warning('Deprecated function eCommerce.Cart.clear() will be removed in future releases');
            var mpid,
                currentUser = self.Identity.getCurrentUser();

            if (currentUser) {
              mpid = currentUser.getMPID();
            }

            self._Identity.mParticleUserCart(mpid).clear();
          }
        },

        /**
         * Sets the currency code
         * @for mParticle.eCommerce
         * @method setCurrencyCode
         * @param {String} code The currency code
         */
        setCurrencyCode: function setCurrencyCode(code) {
          if (!self._Store.isInitialized) {
            self.ready(function () {
              self.eCommerce.setCurrencyCode(code);
            });
            return;
          }

          if (typeof code !== 'string') {
            self.Logger.error('Code must be a string');
            return;
          }

          self._SessionManager.resetSessionTimer();

          self._Store.currencyCode = code;
        },

        /**
         * Creates a product
         * @for mParticle.eCommerce
         * @method createProduct
         * @param {String} name product name
         * @param {String} sku product sku
         * @param {Number} price product price
         * @param {Number} [quantity] product quantity. If blank, defaults to 1.
         * @param {String} [variant] product variant
         * @param {String} [category] product category
         * @param {String} [brand] product brand
         * @param {Number} [position] product position
         * @param {String} [coupon] product coupon
         * @param {Object} [attributes] product attributes
         */
        createProduct: function createProduct(name, sku, price, quantity, variant, category, brand, position, coupon, attributes) {
          return self._Ecommerce.createProduct(name, sku, price, quantity, variant, category, brand, position, coupon, attributes);
        },

        /**
         * Creates a promotion
         * @for mParticle.eCommerce
         * @method createPromotion
         * @param {String} id a unique promotion id
         * @param {String} [creative] promotion creative
         * @param {String} [name] promotion name
         * @param {Number} [position] promotion position
         */
        createPromotion: function createPromotion(id, creative, name, position) {
          return self._Ecommerce.createPromotion(id, creative, name, position);
        },

        /**
         * Creates a product impression
         * @for mParticle.eCommerce
         * @method createImpression
         * @param {String} name impression name
         * @param {Object} product the product for which an impression is being created
         */
        createImpression: function createImpression(name, product) {
          return self._Ecommerce.createImpression(name, product);
        },

        /**
         * Creates a transaction attributes object to be used with a checkout
         * @for mParticle.eCommerce
         * @method createTransactionAttributes
         * @param {String or Number} id a unique transaction id
         * @param {String} [affiliation] affilliation
         * @param {String} [couponCode] the coupon code for which you are creating transaction attributes
         * @param {Number} [revenue] total revenue for the product being purchased
         * @param {String} [shipping] the shipping method
         * @param {Number} [tax] the tax amount
         */
        createTransactionAttributes: function createTransactionAttributes(id, affiliation, couponCode, revenue, shipping, tax) {
          return self._Ecommerce.createTransactionAttributes(id, affiliation, couponCode, revenue, shipping, tax);
        },

        /**
         * Logs a checkout action
         * @for mParticle.eCommerce
         * @method logCheckout
         * @param {Number} step checkout step number
         * @param {String} option
         * @param {Object} attrs
         * @param {Object} [customFlags] Custom flags for the event
         * @deprecated
         */
        logCheckout: function logCheckout(step, option, attrs, customFlags) {
          self.Logger.warning('mParticle.logCheckout is deprecated, please use mParticle.logProductAction instead');

          if (!self._Store.isInitialized) {
            self.ready(function () {
              self.eCommerce.logCheckout(step, option, attrs, customFlags);
            });
            return;
          }

          self._SessionManager.resetSessionTimer();

          self._Events.logCheckoutEvent(step, option, attrs, customFlags);
        },

        /**
         * Logs a product action
         * @for mParticle.eCommerce
         * @method logProductAction
         * @param {Number} productActionType product action type as found [here](https://github.com/mParticle/mparticle-sdk-javascript/blob/master-v2/src/types.js#L206-L218)
         * @param {Object} product the product for which you are creating the product action
         * @param {Object} [attrs] attributes related to the product action
         * @param {Object} [customFlags] Custom flags for the event
         * @param {Object} [transactionAttributes] Transaction Attributes for the event
         */
        logProductAction: function logProductAction(productActionType, product, attrs, customFlags, transactionAttributes) {
          if (!self._Store.isInitialized) {
            self.ready(function () {
              self.eCommerce.logProductAction(productActionType, product, attrs, customFlags, transactionAttributes);
            });
            return;
          }

          self._SessionManager.resetSessionTimer();

          self._Events.logProductActionEvent(productActionType, product, attrs, customFlags, transactionAttributes);
        },

        /**
         * Logs a product purchase
         * @for mParticle.eCommerce
         * @method logPurchase
         * @param {Object} transactionAttributes transactionAttributes object
         * @param {Object} product the product being purchased
         * @param {Boolean} [clearCart] boolean to clear the cart after logging or not. Defaults to false
         * @param {Object} [attrs] other attributes related to the product purchase
         * @param {Object} [customFlags] Custom flags for the event
         * @deprecated
         */
        logPurchase: function logPurchase(transactionAttributes, product, clearCart, attrs, customFlags) {
          self.Logger.warning('mParticle.logPurchase is deprecated, please use mParticle.logProductAction instead');

          if (!self._Store.isInitialized) {
            self.ready(function () {
              self.eCommerce.logPurchase(transactionAttributes, product, clearCart, attrs, customFlags);
            });
            return;
          }

          if (!transactionAttributes || !product) {
            self.Logger.error(Messages$9.ErrorMessages.BadLogPurchase);
            return;
          }

          self._SessionManager.resetSessionTimer();

          self._Events.logPurchaseEvent(transactionAttributes, product, attrs, customFlags);
        },

        /**
         * Logs a product promotion
         * @for mParticle.eCommerce
         * @method logPromotion
         * @param {Number} type the promotion type as found [here](https://github.com/mParticle/mparticle-sdk-javascript/blob/master-v2/src/types.js#L275-L279)
         * @param {Object} promotion promotion object
         * @param {Object} [attrs] boolean to clear the cart after logging or not
         * @param {Object} [customFlags] Custom flags for the event
         */
        logPromotion: function logPromotion(type, promotion, attrs, customFlags) {
          if (!self._Store.isInitialized) {
            self.ready(function () {
              self.eCommerce.logPromotion(type, promotion, attrs, customFlags);
            });
            return;
          }

          self._SessionManager.resetSessionTimer();

          self._Events.logPromotionEvent(type, promotion, attrs, customFlags);
        },

        /**
         * Logs a product impression
         * @for mParticle.eCommerce
         * @method logImpression
         * @param {Object} impression product impression object
         * @param {Object} attrs attributes related to the impression log
         * @param {Object} [customFlags] Custom flags for the event
         */
        logImpression: function logImpression(impression, attrs, customFlags) {
          if (!self._Store.isInitialized) {
            self.ready(function () {
              self.eCommerce.logImpression(impression, attrs, customFlags);
            });
            return;
          }

          self._SessionManager.resetSessionTimer();

          self._Events.logImpressionEvent(impression, attrs, customFlags);
        },

        /**
         * Logs a refund
         * @for mParticle.eCommerce
         * @method logRefund
         * @param {Object} transactionAttributes transaction attributes related to the refund
         * @param {Object} product product being refunded
         * @param {Boolean} [clearCart] boolean to clear the cart after refund is logged. Defaults to false.
         * @param {Object} [attrs] attributes related to the refund
         * @param {Object} [customFlags] Custom flags for the event
         * @deprecated
         */
        logRefund: function logRefund(transactionAttributes, product, clearCart, attrs, customFlags) {
          self.Logger.warning('mParticle.logRefund is deprecated, please use mParticle.logProductAction instead');

          if (!self._Store.isInitialized) {
            self.ready(function () {
              self.eCommerce.logRefund(transactionAttributes, product, clearCart, attrs, customFlags);
            });
            return;
          }

          self._SessionManager.resetSessionTimer();

          self._Events.logRefundEvent(transactionAttributes, product, attrs, customFlags);
        },
        expandCommerceEvent: function expandCommerceEvent(event) {
          return self._Ecommerce.expandCommerceEvent(event);
        }
      };
      /**
       * Sets a session attribute
       * @method setSessionAttribute
       * @param {String} key key for session attribute
       * @param {String or Number} value value for session attribute
       */

      this.setSessionAttribute = function (key, value) {
        if (!self._Store.isInitialized) {
          self.ready(function () {
            self.setSessionAttribute(key, value);
          });
          return;
        } // Logs to cookie
        // And logs to in-memory object
        // Example: mParticle.setSessionAttribute('location', '33431');


        if (self._Helpers.canLog()) {
          if (!self._Helpers.Validators.isValidAttributeValue(value)) {
            self.Logger.error(Messages$9.ErrorMessages.BadAttribute);
            return;
          }

          if (!self._Helpers.Validators.isValidKeyValue(key)) {
            self.Logger.error(Messages$9.ErrorMessages.BadKey);
            return;
          }

          if (self._Store.webviewBridgeEnabled) {
            self._NativeSdkHelpers.sendToNative(Constants.NativeSdkPaths.SetSessionAttribute, JSON.stringify({
              key: key,
              value: value
            }));
          } else {
            var existingProp = self._Helpers.findKeyInObject(self._Store.sessionAttributes, key);

            if (existingProp) {
              key = existingProp;
            }

            self._Store.sessionAttributes[key] = value;

            self._Persistence.update();

            self._Forwarders.applyToForwarders('setSessionAttribute', [key, value]);
          }
        }
      };
      /**
       * Set opt out of logging
       * @method setOptOut
       * @param {Boolean} isOptingOut boolean to opt out or not. When set to true, opt out of logging.
       */


      this.setOptOut = function (isOptingOut) {
        if (!self._Store.isInitialized) {
          self.ready(function () {
            self.setOptOut(isOptingOut);
          });
          return;
        }

        self._SessionManager.resetSessionTimer();

        self._Store.isEnabled = !isOptingOut;

        self._Events.logOptOut();

        self._Persistence.update();

        if (self._Store.activeForwarders.length) {
          self._Store.activeForwarders.forEach(function (forwarder) {
            if (forwarder.setOptOut) {
              var result = forwarder.setOptOut(isOptingOut);

              if (result) {
                self.Logger.verbose(result);
              }
            }
          });
        }
      };
      /**
       * Set or remove the integration attributes for a given integration ID.
       * Integration attributes are keys and values specific to a given integration. For example,
       * many integrations have their own internal user/device ID. mParticle will store integration attributes
       * for a given device, and will be able to use these values for server-to-server communication to services.
       * This is often useful when used in combination with a server-to-server feed, allowing the feed to be enriched
       * with the necessary integration attributes to be properly forwarded to the given integration.
       * @method setIntegrationAttribute
       * @param {Number} integrationId mParticle integration ID
       * @param {Object} attrs a map of attributes that will replace any current attributes. The keys are predefined by mParticle.
       * Please consult with the mParticle docs or your solutions consultant for the correct value. You may
       * also pass a null or empty map here to remove all of the attributes.
       */


      this.setIntegrationAttribute = function (integrationId, attrs) {
        if (!self._Store.isInitialized) {
          self.ready(function () {
            self.setIntegrationAttribute(integrationId, attrs);
          });
          return;
        }

        if (typeof integrationId !== 'number') {
          self.Logger.error('integrationId must be a number');
          return;
        }

        if (attrs === null) {
          self._Store.integrationAttributes[integrationId] = {};
        } else if (self._Helpers.isObject(attrs)) {
          if (Object.keys(attrs).length === 0) {
            self._Store.integrationAttributes[integrationId] = {};
          } else {
            for (var key in attrs) {
              if (typeof key === 'string') {
                if (typeof attrs[key] === 'string') {
                  if (self._Helpers.isObject(self._Store.integrationAttributes[integrationId])) {
                    self._Store.integrationAttributes[integrationId][key] = attrs[key];
                  } else {
                    self._Store.integrationAttributes[integrationId] = {};
                    self._Store.integrationAttributes[integrationId][key] = attrs[key];
                  }
                } else {
                  self.Logger.error('Values for integration attributes must be strings. You entered a ' + _typeof(attrs[key]));
                  continue;
                }
              } else {
                self.Logger.error('Keys must be strings, you entered a ' + _typeof(key));
                continue;
              }
            }
          }
        } else {
          self.Logger.error('Attrs must be an object with keys and values. You entered a ' + _typeof(attrs));
          return;
        }

        self._Persistence.update();
      };
      /**
       * Get integration attributes for a given integration ID.
       * @method getIntegrationAttributes
       * @param {Number} integrationId mParticle integration ID
       * @return {Object} an object map of the integrationId's attributes
       */


      this.getIntegrationAttributes = function (integrationId) {
        if (self._Store.integrationAttributes[integrationId]) {
          return self._Store.integrationAttributes[integrationId];
        } else {
          return {};
        }
      }; // Used by our forwarders


      this.addForwarder = function (forwarder) {
        self._preInit.forwarderConstructors.push(forwarder);
      };

      this.configurePixel = function (settings) {
        self._Forwarders.configurePixel(settings);
      };

      this._getActiveForwarders = function () {
        return self._Store.activeForwarders;
      };

      this._getIntegrationDelays = function () {
        return self._preInit.integrationDelays;
      };

      this._setIntegrationDelay = function (module, _boolean) {
        self._preInit.integrationDelays[module] = _boolean;
      };
    } // Some (server) config settings need to be returned before they are set on SDKConfig in a self hosted environment

    function completeSDKInitialization(apiKey, config, mpInstance) {
      var kitBlocker = createKitBlocker(config, mpInstance);
      mpInstance._APIClient = new APIClient(mpInstance, kitBlocker);
      mpInstance._Forwarders = new Forwarders(mpInstance, kitBlocker);

      if (config.flags) {
        if (config.flags.hasOwnProperty(Constants.FeatureFlags.EventsV3)) {
          mpInstance._Store.SDKConfig.flags[Constants.FeatureFlags.EventsV3] = config.flags[Constants.FeatureFlags.EventsV3];
        }

        if (config.flags.hasOwnProperty(Constants.FeatureFlags.EventBatchingIntervalMillis)) {
          mpInstance._Store.SDKConfig.flags[Constants.FeatureFlags.EventBatchingIntervalMillis] = config.flags[Constants.FeatureFlags.EventBatchingIntervalMillis];
        }
      }

      mpInstance._Store.storageName = mpInstance._Helpers.createMainStorageName(config.workspaceToken);
      mpInstance._Store.prodStorageName = mpInstance._Helpers.createProductStorageName(config.workspaceToken);

      if (config.hasOwnProperty('workspaceToken')) {
        mpInstance._Store.SDKConfig.workspaceToken = config.workspaceToken;
      } else {
        mpInstance.Logger.warning('You should have a workspaceToken on your config object for security purposes.');
      }

      if (config.hasOwnProperty('requiredWebviewBridgeName')) {
        mpInstance._Store.SDKConfig.requiredWebviewBridgeName = config.requiredWebviewBridgeName;
      } else if (config.hasOwnProperty('workspaceToken')) {
        mpInstance._Store.SDKConfig.requiredWebviewBridgeName = config.workspaceToken;
      }

      mpInstance._Store.webviewBridgeEnabled = mpInstance._NativeSdkHelpers.isWebviewEnabled(mpInstance._Store.SDKConfig.requiredWebviewBridgeName, mpInstance._Store.SDKConfig.minWebviewBridgeVersion);
      mpInstance._Store.configurationLoaded = true;

      if (!mpInstance._Store.webviewBridgeEnabled) {
        // Migrate any cookies from previous versions to current cookie version
        mpInstance._Migrations.migrate(); // Load any settings/identities/attributes from cookie or localStorage


        mpInstance._Persistence.initializeStorage();
      }

      if (mpInstance._Store.webviewBridgeEnabled) {
        mpInstance._NativeSdkHelpers.sendToNative(Constants.NativeSdkPaths.SetSessionAttribute, JSON.stringify({
          key: '$src_env',
          value: 'webview'
        }));

        if (apiKey) {
          mpInstance._NativeSdkHelpers.sendToNative(Constants.NativeSdkPaths.SetSessionAttribute, JSON.stringify({
            key: '$src_key',
            value: apiKey
          }));
        }
      } else {
        var currentUser; // If no initialIdentityRequest is passed in, we set the user identities to what is currently in cookies for the identify request

        if (mpInstance._Helpers.isObject(mpInstance._Store.SDKConfig.identifyRequest) && mpInstance._Helpers.isObject(mpInstance._Store.SDKConfig.identifyRequest.userIdentities) && Object.keys(mpInstance._Store.SDKConfig.identifyRequest.userIdentities).length === 0 || !mpInstance._Store.SDKConfig.identifyRequest) {
          var modifiedUIforIdentityRequest = {};
          currentUser = mpInstance.Identity.getCurrentUser();

          if (currentUser) {
            var identities = currentUser.getUserIdentities().userIdentities || {};

            for (var identityKey in identities) {
              if (identities.hasOwnProperty(identityKey)) {
                modifiedUIforIdentityRequest[identityKey] = identities[identityKey];
              }
            }
          }

          mpInstance._Store.SDKConfig.identifyRequest = {
            userIdentities: modifiedUIforIdentityRequest
          };
        } // If migrating from pre-IDSync to IDSync, a sessionID will exist and an identify request will not have been fired, so we need this check


        if (mpInstance._Store.migratingToIDSyncCookies) {
          mpInstance.Identity.identify(mpInstance._Store.SDKConfig.identifyRequest, mpInstance._Store.SDKConfig.identityCallback);
          mpInstance._Store.migratingToIDSyncCookies = false;
        }

        currentUser = mpInstance.Identity.getCurrentUser();

        if (mpInstance._Helpers.getFeatureFlag(Constants.FeatureFlags.ReportBatching)) {
          mpInstance._ForwardingStatsUploader.startForwardingStatsTimer();
        }

        mpInstance._Forwarders.processForwarders(config, mpInstance._APIClient.prepareForwardingStats); // Call mParticle._Store.SDKConfig.identityCallback when identify was not called due to a reload or a sessionId already existing


        if (!mpInstance._Store.identifyCalled && mpInstance._Store.SDKConfig.identityCallback && currentUser && currentUser.getMPID()) {
          mpInstance._Store.SDKConfig.identityCallback({
            httpCode: HTTPCodes$2.activeSession,
            getUser: function getUser() {
              return mpInstance._Identity.mParticleUser(currentUser.getMPID());
            },
            getPreviousUser: function getPreviousUser() {
              var users = mpInstance.Identity.getUsers();
              var mostRecentUser = users.shift();

              if (mostRecentUser && currentUser && mostRecentUser.getMPID() === currentUser.getMPID()) {
                mostRecentUser = users.shift();
              }

              return mostRecentUser || null;
            },
            body: {
              mpid: currentUser.getMPID(),
              is_logged_in: mpInstance._Store.isLoggedIn,
              matched_identities: currentUser.getUserIdentities().userIdentities,
              context: null,
              is_ephemeral: false
            }
          });
        }

        mpInstance._SessionManager.initialize();

        mpInstance._Events.logAST();
      }

      mpInstance._Store.isInitialized = true; // Call any functions that are waiting for the library to be initialized

      if (mpInstance._preInit.readyQueue && mpInstance._preInit.readyQueue.length) {
        mpInstance._preInit.readyQueue.forEach(function (readyQueueItem) {
          if (mpInstance._Helpers.Validators.isFunction(readyQueueItem)) {
            readyQueueItem();
          } else if (Array.isArray(readyQueueItem)) {
            processPreloadedItem(readyQueueItem, mpInstance);
          }
        });

        mpInstance._preInit.readyQueue = [];
      }

      if (mpInstance._Store.isFirstRun) {
        mpInstance._Store.isFirstRun = false;
      }
    }

    function createKitBlocker(config, mpInstance) {
      var kitBlocker, dataPlanForKitBlocker, kitBlockError, kitBlockOptions;
      /*  There are three ways a data plan object for blocking can be passed to the SDK:
              1. Manually via config.dataPlanOptions (this takes priority)
              If not passed in manually, we user the server provided via either
              2. Snippet via /mparticle.js endpoint (config.dataPlan.document)
              3. Self hosting via /config endpoint (config.dataPlanResult)
      */

      if (config.dataPlanOptions) {
        mpInstance.Logger.verbose('Customer provided data plan found');
        kitBlockOptions = config.dataPlanOptions;
        dataPlanForKitBlocker = {
          document: {
            dtpn: {
              vers: kitBlockOptions.dataPlanVersion,
              blok: {
                ev: kitBlockOptions.blockEvents,
                ea: kitBlockOptions.blockEventAttributes,
                ua: kitBlockOptions.blockUserAttributes,
                id: kitBlockOptions.blockUserIdentities
              }
            }
          }
        };
      }

      if (!dataPlanForKitBlocker) {
        // config.dataPlan.document returns on /mparticle.js endpoint
        if (config.dataPlan && config.dataPlan.document) {
          if (config.dataPlan.document.error_message) {
            kitBlockError = config.dataPlan.document.error_message;
          } else {
            mpInstance.Logger.verbose('Data plan found from mParticle.js');
            dataPlanForKitBlocker = config.dataPlan;
          }
        } // config.dataPlanResult returns on /config endpoint
        else if (config.dataPlanResult) {
            if (config.dataPlanResult.error_message) {
              kitBlockError = config.dataPlanResult.error_message;
            } else {
              mpInstance.Logger.verbose('Data plan found from /config');
              dataPlanForKitBlocker = {
                document: config.dataPlanResult
              };
            }
          }
      }

      if (kitBlockError) {
        mpInstance.Logger.error(kitBlockError);
      }

      if (dataPlanForKitBlocker) {
        kitBlocker = new KitBlocker(dataPlanForKitBlocker, mpInstance);
      }

      return kitBlocker;
    }

    function runPreConfigFetchInitialization(mpInstance, apiKey, config) {
      mpInstance.Logger = new Logger(config);
      mpInstance._Store = new Store(config, mpInstance);
      window.mParticle.Store = mpInstance._Store;
      mpInstance._Store.devToken = apiKey || null;
      mpInstance.Logger.verbose(Messages$9.InformationMessages.StartingInitialization); //check to see if localStorage is available for migrating purposes

      try {
        mpInstance._Store.isLocalStorageAvailable = mpInstance._Persistence.determineLocalStorageAvailability(window.localStorage);
      } catch (e) {
        mpInstance.Logger.warning('localStorage is not available, using cookies if available');
        mpInstance._Store.isLocalStorageAvailable = false;
      }
    }

    function processPreloadedItem(readyQueueItem, mpInstance) {
      var args = readyQueueItem,
          method = args.splice(0, 1)[0]; // if the first argument is a method on the base mParticle object, run it

      if (mParticle[args[0]]) {
        mParticle[method].apply(this, args); // otherwise, the method is on either eCommerce or Identity objects, ie. "eCommerce.setCurrencyCode", "Identity.login"
      } else {
        var methodArray = method.split('.');

        try {
          var computedMPFunction = mParticle;

          for (var i = 0; i < methodArray.length; i++) {
            var currentMethod = methodArray[i];
            computedMPFunction = computedMPFunction[currentMethod];
          }

          computedMPFunction.apply(this, args);
        } catch (e) {
          mpInstance.Logger.verbose('Unable to compute proper mParticle function ' + e);
        }
      }
    }

    if (!Array.prototype.forEach) {
      Array.prototype.forEach = Polyfill.forEach;
    }

    if (!Array.prototype.map) {
      Array.prototype.map = Polyfill.map;
    }

    if (!Array.prototype.filter) {
      Array.prototype.filter = Polyfill.filter;
    }

    if (!Array.isArray) {
      Array.prototype.isArray = Polyfill.isArray;
    }

    function mParticle$1() {
      var self = this; // Only leaving this here in case any clients are trying to access mParticle.Store, to prevent from throwing

      this.Store = {};
      this._instances = {};
      this.IdentityType = Types.IdentityType;
      this.EventType = Types.EventType;
      this.CommerceEventType = Types.CommerceEventType;
      this.PromotionType = Types.PromotionActionType;
      this.ProductActionType = Types.ProductActionType;

      if (typeof window !== 'undefined') {
        this.isIOS = window.mParticle && window.mParticle.isIOS ? window.mParticle.isIOS : false;
        this.config = window.mParticle && window.mParticle.config ? window.mParticle.config : {};
      }
      /**
       * Initializes the mParticle instance. If no instanceName is provided, an instance name of `default_instance` will be used.
       * <p>
       * If you'd like to initiate multiple mParticle instances, first review our <a href="https://docs.mparticle.com/developers/sdk/web/multiple-instances/">doc site</a>, and ensure you pass a unique instance name as the third argument as shown below.
       * @method init
       * @param {String} apiKey your mParticle assigned API key
       * @param {Object} [config] an options object for additional configuration
       * @param {String} [instanceName] If you are self hosting the JS SDK and working with multiple instances, you would pass an instanceName to `init`. This instance will be selected when invoking other methods. See the above link to the doc site for more info and examples.
       */


      this.init = function (apiKey, config, instanceName) {
        if (!config && window.mParticle && window.mParticle.config) {
          console.warn('You did not pass a config object to mParticle.init(). Attempting to use the window.mParticle.config if it exists. Please note that in a future release, this may not work and mParticle will not initialize properly');
          config = window.mParticle ? window.mParticle.config : {};
        }

        instanceName = (!instanceName || instanceName.length === 0 ? Constants.DefaultInstance : instanceName).toLowerCase();
        var client = self._instances[instanceName];

        if (client === undefined) {
          client = new mParticleInstance(apiKey, config, instanceName);
          self._instances[instanceName] = client;
        }

        client.init(apiKey, config, instanceName);
      };

      this.getInstance = function getInstance(instanceName) {
        var client;

        if (!instanceName) {
          instanceName = Constants.DefaultInstance;
          client = self._instances[instanceName];

          if (!client) {
            client = new mParticleInstance(instanceName);
            self._instances[Constants.DefaultInstance] = client;
          }

          return client;
        } else {
          client = self._instances[instanceName.toLowerCase()];

          if (!client) {
            console.log('You tried to initialize an instance named ' + instanceName + '. This instance does not exist. Check your instance name or initialize a new instance with this name before calling it.');
            return null;
          }

          return client;
        }
      };

      this.getDeviceId = function () {
        return self.getInstance().getDeviceId();
      };

      this.startNewSession = function () {
        self.getInstance().startNewSession();
      };

      this.endSession = function () {
        self.getInstance().endSession();
      };

      this.setLogLevel = function (newLogLevel) {
        self.getInstance().setLogLevel(newLogLevel);
      };

      this.ready = function (argument) {
        self.getInstance().ready(argument);
      };

      this.setAppVersion = function (version) {
        self.getInstance().setAppVersion(version);
      };

      this.getAppName = function () {
        return self.getInstance().getAppName();
      };

      this.setAppName = function (name) {
        self.getInstance().setAppName(name);
      };

      this.getAppVersion = function () {
        return self.getInstance().getAppVersion();
      };

      this.stopTrackingLocation = function () {
        self.getInstance().stopTrackingLocation();
      };

      this.startTrackingLocation = function (callback) {
        self.getInstance().startTrackingLocation(callback);
      };

      this.setPosition = function (lat, lng) {
        self.getInstance().setPosition(lat, lng);
      };

      this.startNewSession = function () {
        self.getInstance().startNewSession();
      };

      this.endSession = function () {
        self.getInstance().endSession();
      };

      this.logBaseEvent = function (event) {
        self.getInstance().logBaseEvent(event);
      };

      this.logEvent = function (eventName, eventType, eventInfo, customFlags) {
        self.getInstance().logEvent(eventName, eventType, eventInfo, customFlags);
      };

      this.logError = function (error, attrs) {
        self.getInstance().logError(error, attrs);
      };

      this.logLink = function (selector, eventName, eventType, eventInfo) {
        self.getInstance().logLink(selector, eventName, eventType, eventInfo);
      };

      this.logForm = function (selector, eventName, eventType, eventInfo) {
        self.getInstance().logForm(selector, eventName, eventType, eventInfo);
      };

      this.logPageView = function (eventName, attrs, customFlags) {
        self.getInstance().logPageView(eventName, attrs, customFlags);
      };

      this.upload = function () {
        self.getInstance().upload();
      };

      this.eCommerce = {
        Cart: {
          add: function add(product, logEventBoolean) {
            self.getInstance().eCommerce.Cart.add(product, logEventBoolean);
          },
          remove: function remove(product, logEventBoolean) {
            self.getInstance().eCommerce.Cart.remove(product, logEventBoolean);
          },
          clear: function clear() {
            self.getInstance().eCommerce.Cart.clear();
          }
        },
        setCurrencyCode: function setCurrencyCode(code) {
          self.getInstance().eCommerce.setCurrencyCode(code);
        },
        createProduct: function createProduct(name, sku, price, quantity, variant, category, brand, position, coupon, attributes) {
          return self.getInstance().eCommerce.createProduct(name, sku, price, quantity, variant, category, brand, position, coupon, attributes);
        },
        createPromotion: function createPromotion(id, creative, name, position) {
          return self.getInstance().eCommerce.createPromotion(id, creative, name, position);
        },
        createImpression: function createImpression(name, product) {
          return self.getInstance().eCommerce.createImpression(name, product);
        },
        createTransactionAttributes: function createTransactionAttributes(id, affiliation, couponCode, revenue, shipping, tax) {
          return self.getInstance().eCommerce.createTransactionAttributes(id, affiliation, couponCode, revenue, shipping, tax);
        },
        logCheckout: function logCheckout(step, options, attrs, customFlags) {
          self.getInstance().eCommerce.logCheckout(step, options, attrs, customFlags);
        },
        logProductAction: function logProductAction(productActionType, product, attrs, customFlags, transactionAttributes) {
          self.getInstance().eCommerce.logProductAction(productActionType, product, attrs, customFlags, transactionAttributes);
        },
        logPurchase: function logPurchase(transactionAttributes, product, clearCart, attrs, customFlags) {
          self.getInstance().eCommerce.logPurchase(transactionAttributes, product, clearCart, attrs, customFlags);
        },
        logPromotion: function logPromotion(type, promotion, attrs, customFlags) {
          self.getInstance().eCommerce.logPromotion(type, promotion, attrs, customFlags);
        },
        logImpression: function logImpression(impression, attrs, customFlags) {
          self.getInstance().eCommerce.logImpression(impression, attrs, customFlags);
        },
        logRefund: function logRefund(transactionAttributes, product, clearCart, attrs, customFlags) {
          self.getInstance().eCommerce.logRefund(transactionAttributes, product, clearCart, attrs, customFlags);
        },
        expandCommerceEvent: function expandCommerceEvent(event) {
          return self.getInstance().eCommerce.expandCommerceEvent(event);
        }
      };

      this.setSessionAttribute = function (key, value) {
        self.getInstance().setSessionAttribute(key, value);
      };

      this.setOptOut = function (isOptingOut) {
        self.getInstance().setOptOut(isOptingOut);
      };

      this.setIntegrationAttribute = function (integrationId, attrs) {
        self.getInstance().setIntegrationAttribute(integrationId, attrs);
      };

      this.getIntegrationAttributes = function (moduleId) {
        return self.getInstance().getIntegrationAttributes(moduleId);
      };

      this.Identity = {
        HTTPCodes: self.getInstance().Identity.HTTPCodes,
        aliasUsers: function aliasUsers(aliasRequest, callback) {
          self.getInstance().Identity.aliasUsers(aliasRequest, callback);
        },
        createAliasRequest: function createAliasRequest(sourceUser, destinationUser) {
          return self.getInstance().Identity.createAliasRequest(sourceUser, destinationUser);
        },
        getCurrentUser: function getCurrentUser() {
          return self.getInstance().Identity.getCurrentUser();
        },
        getUser: function getUser(mpid) {
          return self.getInstance().Identity.getUser(mpid);
        },
        getUsers: function getUsers() {
          return self.getInstance().Identity.getUsers();
        },
        identify: function identify(identityApiData, callback) {
          self.getInstance().Identity.identify(identityApiData, callback);
        },
        login: function login(identityApiData, callback) {
          self.getInstance().Identity.login(identityApiData, callback);
        },
        logout: function logout(identityApiData, callback) {
          self.getInstance().Identity.logout(identityApiData, callback);
        },
        modify: function modify(identityApiData, callback) {
          self.getInstance().Identity.modify(identityApiData, callback);
        }
      };
      this.sessionManager = {
        getSession: function getSession() {
          return self.getInstance()._SessionManager.getSession();
        }
      };
      this.Consent = {
        createConsentState: function createConsentState() {
          return self.getInstance().Consent.createConsentState();
        },
        createGDPRConsent: function createGDPRConsent(consented, timestamp, consentDocument, location, hardwareId) {
          return self.getInstance().Consent.createGDPRConsent(consented, timestamp, consentDocument, location, hardwareId);
        },
        createCCPAConsent: function createCCPAConsent(consented, timestamp, consentDocument, location, hardwareId) {
          return self.getInstance().Consent.createGDPRConsent(consented, timestamp, consentDocument, location, hardwareId);
        }
      };

      this.reset = function () {
        self.getInstance().reset(self.getInstance());
      };

      this._resetForTests = function (MPConfig, keepPersistence) {
        if (typeof keepPersistence === 'boolean') {
          self.getInstance()._resetForTests(MPConfig, keepPersistence, self.getInstance());
        } else {
          self.getInstance()._resetForTests(MPConfig, false, self.getInstance());
        }
      };

      this.configurePixel = function (settings) {
        self.getInstance().configurePixel(settings);
      };

      this._setIntegrationDelay = function (moduleId, _boolean) {
        self.getInstance()._setIntegrationDelay(moduleId, _boolean);
      };

      this._getIntegrationDelays = function () {
        return self.getInstance()._getIntegrationDelays();
      };

      this.getVersion = function () {
        return self.getInstance().getVersion();
      };

      this.generateHash = function (string) {
        return self.getInstance().generateHash(string);
      };

      this.addForwarder = function (forwarder) {
        self.getInstance().addForwarder(forwarder);
      };

      this._getActiveForwarders = function () {
        return self.getInstance()._getActiveForwarders();
      };
    }

    var mparticleInstance = new mParticle$1();

    if (typeof window !== 'undefined') {
      window.mParticle = mparticleInstance; // window.mParticle._BatchValidator = new _BatchValidator();
    }

    return mparticleInstance;

}());
