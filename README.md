## Direct S3 Upload Process

The application uses pre-signed URLs for direct uploads to S3, which helps avoid the 413 (Payload Too Large) errors when uploading large files through API Gateway.

### Flow:

1. When a file needs to be uploaded, the frontend requests a pre-signed URL from the backend
2. The backend generates a pre-signed URL with temporary permissions to upload to a specific S3 location
3. The frontend uses this URL to upload the file directly to S3, bypassing API Gateway size limits
4. After successful upload, the frontend sends the S3 object key to the backend for processing

This approach has several benefits:
- Avoids API Gateway payload limits (typically 10MB)
- Reduces Lambda execution time and memory usage
- Improves upload reliability for large files
- Reduces backend processing load

### Implementation Details:

The frontend uses the `/koenoto/presigned-url` endpoint to get a pre-signed URL, then performs a PUT request directly to S3 using that URL.

```typescript
// Example code
const getPresignedUrl = async (filename) => {
  const response = await fetch('/api/presigned-url', {
    method: 'POST',
    body: JSON.stringify({ filename })
  });
  return response.json();
};

const uploadFile = async (file) => {
  const { presignedUrl, key } = await getPresignedUrl(file.name);
  await fetch(presignedUrl, {
    method: 'PUT',
    body: file
  });
  return key;
};
```

```bash
aws cloudformation create-stack \
  --stack-name rePr-wireless-backend-stack \
  --template-body file://cloudformation/rePr-wireless_backend.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameters \
    ParameterKey=PublicSubnetAZ,ParameterValue=ap-northeast-1a \
    ParameterKey=PrivateSubnetAZ,ParameterValue=ap-northeast-1c \
  --profile syncbloom_yutabee_dev
```

```bash
aws cloudformation describe-stack-events \
  --stack-name rePr-wireless-backend-stack \
  --profile syncbloom_yutabee_dev \
  --output json | jq -r '
    ["Timestamp", "ResourceType", "LogicalResourceId", "ResourceStatus", "ResourceStatusReason"],
    (.StackEvents[] | [.Timestamp, .ResourceType, .LogicalResourceId, .ResourceStatus, (.ResourceStatusReason // "N/A")])
    | @csv
  ' > stack-events.csv
```

```bash
aws cloudformation delete-stack \
  --stack-name rePr-wireless-backend-stack \
  --profile syncbloom_yutabee_dev
```

## Audio File Handling

The application handles audio files in two ways:

1. **Complete Audio File**: The entire audio file is uploaded as a single file for playback in the frontend. This ensures smooth playback without interruptions.
   - WAV files are automatically converted to MP3 format for better compatibility and smaller file size

2. **Chunked Audio Files**: For transcription and processing, the audio is split into smaller chunks (5MB each). This approach helps with:
   - Processing very large audio files
   - Parallel transcription of different parts of the audio
   - Avoiding timeouts during transcription

### Implementation Details

When a user uploads an audio file:

1. The complete file is uploaded first using a pre-signed URL
2. If the file is a WAV file, it's automatically converted to MP3 format
3. The file is then split into chunks for transcription
4. Each chunk is uploaded using its own pre-signed URL
5. The backend processes the chunks for transcription while the frontend uses the complete MP3 file for playback

### WAV to MP3 Conversion

The application automatically converts WAV files to MP3 format after upload for:
- Smaller file size (better storage efficiency)
- Improved streaming performance
- Better browser compatibility
- Consistent audio format across the application

The conversion process:
1. User uploads a WAV file
2. Backend detects the WAV format
3. The file is downloaded from S3 to the Lambda environment
4. FFmpeg converts the file to MP3 format with high quality settings
5. The MP3 file is uploaded back to S3
6. The frontend uses the MP3 file for playback

This dual approach provides the best user experience while maintaining efficient processing capabilities.

## WAV to MP3 Conversion Setup

To enable WAV to MP3 conversion in the Lambda function, you need to add the FFmpeg Layer to your Lambda function. Follow these steps:

1. Go to the AWS Lambda console
2. Select your Lambda function
3. Scroll down to the "Layers" section
4. Click "Add a layer"
5. Select "Specify an ARN"
6. Enter one of the following ARNs based on your region:
   - For `ap-northeast-1` (Tokyo): `arn:aws:lambda:ap-northeast-1:725887861991:layer:ffmpeg:1`
   - For `us-east-1` (N. Virginia): `arn:aws:lambda:us-east-1:725887861991:layer:ffmpeg:1`
   - For other regions, check [this repository](https://github.com/serverlesspub/ffmpeg-aws-lambda-layer) for available ARNs

7. Click "Add"
8. Increase the Lambda function timeout to at least 30 seconds to allow time for conversion
9. Increase the Lambda memory to at least 512MB for better conversion performance

This layer provides the FFmpeg binary that the Lambda function uses to convert WAV files to MP3.