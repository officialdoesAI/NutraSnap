# AppFlow Build Guide for NutriLens

This guide will help you set up and build the NutriLens iOS app using Ionic AppFlow.

## Prerequisites

1. An Ionic account (sign up at [dashboard.ionicframework.com](https://dashboard.ionicframework.com))
2. Your GitHub repository connected to AppFlow
3. Apple Developer account credentials

## Setup Instructions

### Step 1: Connect Your Repository

1. Log in to your Ionic AppFlow account
2. Click "Apps" and then "New App"
3. Select "GitHub" as the repository source
4. Find and select your NutraSnap repository
5. Configure the app settings (name it "NutriLens" or "NutraSnap")

### Step 2: Install the Ionic CLI

If you haven't already, install the Ionic CLI on your local machine:

```bash
npm install -g @ionic/cli
```

### Step 3: Configure Environment Variables

1. In AppFlow, go to your app settings
2. Click on "Environments"
3. Create a new environment (e.g., "Production")
4. Add the following environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `DATABASE_URL`: Your database connection string

### Step 4: Configure iOS Build

1. Go to the "Credentials" section in your app settings
2. Add your Apple Developer credentials:
   - Certificate (.p12 file)
   - Provisioning profile (.mobileprovision file)
   - Certificate password

### Step 5: Create a Build

1. Go to the "Builds" tab
2. Click "New Build"
3. Select your environment and the branch you want to build from
4. Choose "iOS" as the platform
5. Select your signing certificate and provisioning profile
6. Start the build

### Step 6: Download and Install

1. Once the build is complete, download the IPA file
2. For AltStore: Follow the altstore-install-guide.md instructions
3. For iOS devices: Use Apple TestFlight or enterprise distribution

## Troubleshooting

### Common Issues

1. **Build Fails**: Check that your environment variables are correct
2. **iOS Signing Issues**: Ensure your certificates and provisioning profiles are valid
3. **Repository Connection**: Make sure your GitHub repository is properly connected

### Using the Ionic CLI

For local development and testing with AppFlow:

```bash
# Link your app to AppFlow
ionic link

# Push a new build to AppFlow
ionic deploy build --channel="production"
```

## Additional Resources

- [AppFlow Documentation](https://ionicframework.com/docs/appflow)
- [Capacitor iOS Configuration](https://capacitorjs.com/docs/ios)
- [Managing iOS Certificates](https://ionicframework.com/docs/appflow/package/credentials)