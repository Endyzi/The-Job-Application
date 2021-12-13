using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ServiceStack;
using ServiceStack.OrmLite;
using System.IO;
using ServiceStack.Text;
using ServiceStack.Web;
using ServiceStack.Configuration;

namespace JobApplication.ServiceInterface
{
    public class MyServices : Service
    {
        private readonly string UploadsDir = new AppSettings().Get("uploadFolder");

        public class Application
        {
            public string FullName { get; set; }
            public string Email { get; set; }
            public string Phone { get; set; }
            public string Age { get; set; }
            public string Address { get; set; }
            public string Zip { get; set; }
            public string City { get; set; }
            public string WorkCurrent { get; set; }
            public string WorkCurrentDescription { get; set; }
            public string Experience { get; set; }
            public string Education { get; set; }
            public string PhotoExperience { get; set; }
            public bool Swedish { get; set; }
            public bool Car { get; set; }
            public bool DriversLicense { get; set; }
            public bool CostumerExperience { get; set; }
            public bool YouthExperience { get; set; }
            public string Homepage { get; set; }
            public string[] PreferredWorkplaces { get; set; }

            public string FileCv { get; set; }
            public string FilePersonalLetter { get; set; }
            public string FileProfileImage { get; set; }

            public string Raw { get; set; }
        }

        [Route("/apply")]
        public class Apply : IReturn<ApplicationResponse>
        {
        }

        public class ApplicationResponse
        {
            public string Message { get; set; }
        }

        public object Post(Apply request)
        {
            ApplicationResponse applicationResponse = new ApplicationResponse();

            var json = base.Request.FormData["stepmodels"];
            var application = json.FromJson<Application>();
            application.Raw = json;
            
            var applicationId = this.Db.Insert<Application>(application, true);
            

            try
            {
                SaveFiles(base.Request.Files, application.Email, applicationId);
            }
            catch (Exception ex)
            {
                applicationResponse.Message = "Dina filer kunde ej bifogas.";
            }


            return new HttpResult(new ApplicationResponse())
                {
                    View = "Thankyou"
                };
        }

        private void SaveFiles(ServiceStack.Web.IHttpFile[] files, string user, long applicationId)
        {            
            var dir = UploadsDir.CombineWith(user, applicationId.ToString());
            
            var cv =                files[0];
            var personalLetter =    files[1];
            var profileImage =      files[2];

            VerifyAndSaveFile(cv, dir, "CV");
            VerifyAndSaveFile(personalLetter, dir, "BREV");
            VerifyAndSaveFile(profileImage, dir, "BILD");
        }

        private void VerifyAndSaveFile(IHttpFile file, string dir, string filenameprefix)
        {
            if (!VerifyFilesize(file.ContentLength))
                return;

            if (!VerifyFiletype(file.FileName))
                return;

            var path = Path.Combine(dir, filenameprefix + "_" + file.FileName);

            new FileInfo(path).Directory.Create();
            file.SaveTo(path);
        }

        static double ConvertBytesToMegabytes(long bytes)
        {
            return (bytes / 1024f) / 1024f;
        }

        static bool VerifyFilesize(long bytes)
        {
            int maxFileSizeMb = 10;
            return (bytes < maxFileSizeMb * 1024f * 1024f && bytes > 0);            
        }

        static bool VerifyFiletype(string filename)
        {
            return Path.GetExtension(filename) != ".exe";
        }
    }
}