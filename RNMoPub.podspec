require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
    s.name         = "RNMoPub"
    s.version      = package["version"]
    s.summary      = package["description"]
    s.description  = <<-DESC
    RNMoPub
    DESC
    s.homepage     = "https://github.com/aliasad106/React-Native-Mopub-SDK"
    s.license      = "MIT"
    # s.license    = { :type => "MIT", :file => "FILE_LICENSE" }
    s.author       = { "author" => "author@domain.cn" }
    s.platform     = :ios, "10.0"
    s.source       = { :git => "https://github.com/wowmaking/react-native-mopub", :tag => "#{s.version}" }
    
    s.requires_arc = true
    s.default_subspec = 'Core'
    
    s.dependency 'React'
    s.dependency 'mopub-ios-sdk'
  
    s.subspec "Core" do |ss|
      ss.source_files  = "ios/**/*.{h,m}"
    end
    
    s.subspec "AdColony" do |ss|
        ss.dependency 'MoPub-AdColony-Adapters', '4.1.5.0'
    end

    s.subspec "AdMob" do |ss|
        ss.dependency 'MoPub-AdMob-Adapters', '7.61.0.1'
    end
    
    s.subspec "Tapjoy" do |ss|
        ss.dependency 'MoPub-TapJoy-Adapters', '12.6.0.0'
    end

    s.subspec "Facebook" do |ss|
        ss.dependency 'MoPub-FacebookAudienceNetwork-Adapters', '5.9.0.1'
    end

    s.subspec "Mintegral" do |ss|
        ss.dependency 'MoPub-Mintegral-Adapters', '6.3.3.0.0'
    end

    s.subspec "AppLovin" do |ss|
        ss.dependency 'MoPub-Applovin-Adapters', '6.13.0.0'
    end
    
    s.subspec "Unity" do |ss|
        ss.dependency 'MoPub-UnityAds-Adapters', '3.4.6.0'
    end
    
    s.subspec "Vungle" do |ss|
        ss.dependency 'MoPub-Vungle-Adapters', '6.7.0.0'
    end
    
    s.subspec "Chartboost" do |ss|
        ss.dependency 'MoPub-Chartboost-Adapters', '8.1.0.2'
    end

    s.subspec "IronSource" do |ss|
        ss.dependency 'MoPub-IronSource-Adapters', '6.16.3.0.0'
    end

    if defined?($RNMoPubAsStaticFramework)
        Pod::UI.puts "#{s.name}: Using overridden static_framework value of '#{$RNMoPubAsStaticFramework}'"
        s.static_framework = $RNMoPubAsStaticFramework
    else
        s.static_framework = false
    end
end

