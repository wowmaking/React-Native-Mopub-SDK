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
    s.source_files  = "ios/**/*.{h,m}"
    
    s.dependency 'React'
    s.dependency 'mopub-ios-sdk'

    if defined?($RNMoPubAsStaticFramework)
        Pod::UI.puts "#{s.name}: Using overridden static_framework value of '#{$RNMoPubAsStaticFramework}'"
        s.static_framework = $RNMoPubAsStaticFramework
    else
        s.static_framework = false
    end
end

