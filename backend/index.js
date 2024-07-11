const express = require('express');
const { google } = require("googleapis");
const path = require("path");
const QRCode = require("qrcode");
const fs = require('fs').promises;


const app = express();
var cors = require('cors');
app.use(cors(
  // {
  //   origin : ["https://dspmdm-test.netlify.app/"],
  //   methods : ["POST","GET","DELETE","PUT"],
  //   credentials : true
  // }
));
const PORT = 3000;

app.use(express.json());

const KEY_FILE = path.join(__dirname, "dsp-emm-solution-7c669a1e61e5.json");
const SCOPES = ["https://www.googleapis.com/auth/androidmanagement"];
const PROJECT_ID = "dsp-emm-solution";
const CALLBACK_URL = "https://dspmdm-test.netlify.app/signup";

async function getAuthClient() {
  return new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: SCOPES,
  });
}

async function getAndroidManagementClient() {
  const auth = await getAuthClient();
  return google.androidmanagement({
    version: "v1",
    auth: auth,
  });
}

app.get('/enterprises', async (req, res) => {
  try {
    const androidmanagement = await getAndroidManagementClient();
    const listRes = await androidmanagement.enterprises.list({
      projectId: PROJECT_ID,
    });
    res.json(listRes.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/create-enterprise', async (req, res) => {
  try {
    const androidmanagement = await getAndroidManagementClient();
    
    const signupUrlRes = await androidmanagement.signupUrls.create({
      projectId: PROJECT_ID,
      requestBody: {
        callbackUrl:CALLBACK_URL,
      },
    });

    res.json({
      message: `Please use this URL to create your enterprise: ${signupUrlRes.data.url}`,
      signupUrl: signupUrlRes.data.url
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/enterprise-details', async (req, res) => {
  const { enterprise_token, signupUrlName } = req.body;
  const androidmanagement = await getAndroidManagementClient();
  if (!enterprise_token) {
    return res.status(400).json({ error: 'Enterprise token is required' });
  }

  try {

    // Create or get the enterprise
    const enterprise = await androidmanagement.enterprises.create({
      projectId: PROJECT_ID,
      signupUrlName: signupUrlName,
      enterpriseToken: enterprise_token,
      requestBody: {},
    });

    // Extract relevant details
    const enterpriseDetails = {
      name: enterprise.data.name,
      enterpriseDisplayName: enterprise.data.enterpriseDisplayName,
      primaryDomain: enterprise.data.primaryDomain,
      enabledNotificationTypes: enterprise.data.enabledNotificationTypes,
      adminConsoleLogoUrl: enterprise.data.adminConsoleLogoUrl,
      termsAndConditionsUrl: enterprise.data.termsAndConditionsUrl,
      contactInfo: enterprise.data.contactInfo,
      pubsubTopic: enterprise.data.pubsubTopic,
    };

    res.json(enterpriseDetails);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});



app.post('/signup-url', async (req, res) => {
  try {
    const androidmanagement = await getAndroidManagementClient();
    const signupUrlRes = await androidmanagement.signupUrls.create({
      projectId: PROJECT_ID,
      requestBody: {
        callbackUrl: CALLBACK_URL,
      },
    });
    res.json(signupUrlRes.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

 

app.post('/enrollment-token', async (req, res) => {
  try {
    const { enterpriseId } = req.body;
    const androidmanagement = await getAndroidManagementClient();
    const fullEnterpriseName = `enterprises/${enterpriseId}`;
    const enrollmentToken = await generateEnrollmentToken(androidmanagement, fullEnterpriseName);
    const qrCodeData = JSON.parse(enrollmentToken.qrCode);
    const stringifiedData = JSON.stringify(qrCodeData);

    const qrCodePath = path.join(__dirname, `qr_codes/${enterpriseId}_qr.png`);
    await fs.mkdir(path.dirname(qrCodePath), { recursive: true });
    await QRCode.toFile(qrCodePath, stringifiedData);

    res.json({
      enrollmentToken,
      stringifiedData,
      message: 'Enrollment token generated with 10-year validity'
    });
  } catch (error) {
    console.error('Error generating enrollment token:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/devices/:enterpriseId', async (req, res) => {
  try {
    const { enterpriseId } = req.params;
    const fullEnterpriseName = `enterprises/${enterpriseId}`;
    const devices = await listEnrolledDevices(fullEnterpriseName);
    res.json(devices);
  } catch (error) {
    console.error('Error listing devices:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/policy', async (req, res) => {
  try {
    const { enterpriseId, allowedApps } = req.body;
    const fullEnterpriseName = `enterprises/${enterpriseId}`;
    const updatedPolicy = await createOrUpdateAppPolicy(fullEnterpriseName, allowedApps);
    res.json({ message: 'Policy created or updated successfully', policy: updatedPolicy });
  } catch (error) {
    console.error('Error creating/updating policy:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/apply-policy-device', async (req, res) => {
  try {
    const { enterpriseId, deviceId, policyName } = req.body;
    const fullDeviceName = `enterprises/${enterpriseId}/devices/${deviceId}`;
    const fullPolicyName = `enterprises/${enterpriseId}/policies/${policyName}`;
    const result = await applyPolicyToDevice(fullDeviceName, fullPolicyName);
    res.json({ message: 'Policy applied to device', result });
  } catch (error) {
    console.error('Error applying policy to device:', error);
    res.status(500).json({ error: error.message });
  }
});


app.post('/apply-policy-all', async (req, res) => {
  try {
    const { enterpriseId, policyName } = req.body;
    const results = await applyPolicyToAllDevices(enterpriseId, policyName);
    res.json({ message: 'Policy application process completed', results });
  } catch (error) {
    console.error('Error applying policy to all devices:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/device/:enterpriseId/:deviceId', async (req, res) => {
  try {
    const { enterpriseId, deviceId } = req.params;
    const fullDeviceName = `enterprises/${enterpriseId}/devices/${deviceId}`;
    const result = await deleteDevice(fullDeviceName);
    res.json(result);
  } catch (error) {
    console.error('Error deleting device:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/enterprise/:enterpriseId', async (req, res) => {
  try {
    const { enterpriseId } = req.params;
    const androidmanagement = await getAndroidManagementClient();

    // Construct the full enterprise name
    const fullEnterpriseName = `enterprises/${enterpriseId}`;

    await androidmanagement.enterprises.delete({
      name: fullEnterpriseName
    });

    // If successful, also delete the associated QR code if it exists
    const qrCodePath = path.join(__dirname, `qr_codes/${enterpriseId}_qr.png`);
    await fs.unlink(qrCodePath).catch(() => {}); // Ignore error if file doesn't exist

    res.json({ message: `Enterprise ${fullEnterpriseName} has been successfully deleted.` });
  } catch (error) {
    console.error('Error deleting enterprise:', error);
    
    if (error.response) {
      if (error.response.status === 403) {
        res.status(403).json({ error: "You don't have permission to delete this enterprise." });
      } else if (error.response.status === 404) {
        res.status(404).json({ error: "Enterprise not found." });
      } else {
        res.status(error.response.status).json({ error: error.response.data });
      }
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

async function generateEnrollmentToken(androidmanagement, enterpriseName) {
  try {
    // Calculate the expiration time (100 years from now)
    const expirationTime = new Date();
    expirationTime.setFullYear(expirationTime.getFullYear() + 10);



    const res = await androidmanagement.enterprises.enrollmentTokens.create({
      parent: enterpriseName,
      requestBody: {
        duration: `${10 * 365 * 24 * 60 * 60}s`, // 10 years in seconds
        expirationTimestamp: expirationTime.toISOString(),
        policyName : "masterPolicy"
      },

    });
    return res.data;
  } catch (error) {
    console.error("Error generating enrollment token:", error);
    throw error;
  }
}

async function listEnrolledDevices(fullEnterpriseName) {
  const androidmanagement = await getAndroidManagementClient();

  try {
    const res = await androidmanagement.enterprises.devices.list({
      parent: fullEnterpriseName,
    });

    return res.data.devices || [];
  } catch (error) {
    console.error('Error listing devices:', error);
    throw error;
  }
}

async function applyPolicyToAllDevices(enterpriseId, policyName) {
  const fullEnterpriseName = `enterprises/${enterpriseId}`;
  const devices = await listEnrolledDevices(fullEnterpriseName);
  const results = [];

  for (const device of devices) {
    try {
      const result = await applyPolicyToDevice(device.name, `${fullEnterpriseName}/policies/${policyName}`);
      results.push({ deviceId: device.name.split('/').pop(), status: 'success', result });
    } catch (error) {
      results.push({ deviceId: device.name.split('/').pop(), status: 'error', error: error.message });
    }
  }

  return results;
}

async function deleteDevice(fullDeviceName) {
  const androidmanagement = await getAndroidManagementClient();

  try {
    await androidmanagement.enterprises.devices.delete({
      name: fullDeviceName
    });
    console.log('Device deleted:', fullDeviceName);
    return { status: 'success', message: 'Device deleted successfully' };
  } catch (error) {
    console.error('Error deleting device:', error);
    throw error;
  }
}



async function createOrUpdateAppPolicy(fullEnterpriseName, allowedApps) {
  const androidmanagement = await getAndroidManagementClient();

  const policy = {
    name : 'Policy101',
    cameraDisabled : "true",
    applications: allowedApps.map(app => ({
      packageName: app,
      installType: 'FORCE_INSTALLED',
    })),
    playStoreMode: 'WHITELIST',
  };

  try {
    const res = await androidmanagement.enterprises.policies.patch({
      name: `${fullEnterpriseName}/policies/masterPolicy`,
      updateMask: 'applications,playStoreMode',
      requestBody: policy,
    });
    console.log('Policy created or updated:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error creating/updating policy:', error);
    throw error;
  }
}

async function applyPolicyToDevice(fullDeviceName, policyName) {
  const androidmanagement = await getAndroidManagementClient();

  try {
    const res = await androidmanagement.enterprises.devices.patch({
      name: fullDeviceName,
      updateMask: 'policyName',
      requestBody: {
        policyName: policyName
      }
    });
    console.log('Policy applied to device:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error applying policy to device:', error);
    throw error;
  }
}




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));