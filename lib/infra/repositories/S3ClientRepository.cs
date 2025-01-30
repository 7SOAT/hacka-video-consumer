using Amazon.S3;
using Amazon.S3.Model;
using Amazon.SQS;
using hacka_video_consumer.lib.adapters.gateways;

namespace hacka_video_consumer;

public class S3ClientRepository : S3ClientGateway 
{
    private readonly IAmazonS3 _s3Client;

    public S3ClientRepository(IAmazonS3 s3Client)
    {
        _s3Client = s3Client;
    }

    public async Task GetS3Object(string bucketName, string key)
    {
        GetObjectRequest request = new GetObjectRequest
        {
            BucketName = bucketName,
            Key = bucketName + "/" + key
        };
        
        using (GetObjectResponse response = await _s3Client.GetObjectAsync(request))
        {
            using (StreamReader reader = new StreamReader(response.ResponseStream))
            {
                string contents = reader.ReadToEnd();
                Console.WriteLine("Object - " + response.Key);
                Console.WriteLine(" Version Id - " + response.VersionId);
                Console.WriteLine(" Contents - " + contents);
            }
        }
    }
}