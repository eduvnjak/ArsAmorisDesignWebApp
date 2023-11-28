using Microsoft.EntityFrameworkCore;
using ArsAmorisDesignApi.Data;
using ArsAmorisDesignApi.Services.UserService;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using ArsAmorisDesignApi.Services.ProductService;
using Microsoft.Extensions.FileProviders;
using ArsAmorisDesignApi.Services.ProductCategoryService;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173")
                          .AllowAnyHeader().AllowAnyMethod();
                      });
});
// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();
builder.Services.AddDbContext<AppDbContext>(opt =>
opt.UseMySQL("server=localhost;database=ars_amoris_design_db;user=root;password=password"));
//skloni ovo u appsettings
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    //sta je ovo
    // options.AddSecurityRequirement(
    //     new OpenApiSecurityRequirement
    //     {
    //         {
    //             new OpenApiSecurityScheme
    //             {
    //                 Reference = new OpenApiReference
    //                 {
    //                     Type = ReferenceType.SecurityScheme,
    //                     Id = "Bearer"
    //                 }
    //             },
    //         Array.Empty<String>()
    //         }
    //     }
    // );
    options.OperationFilter<Swashbuckle.AspNetCore.Filters.SecurityRequirementsOperationFilter>("Bearer");

});
//u add auth nista ne treba
builder.Services.AddAuthentication().AddJwtBearer(options =>
{
    //require https metadata???
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false, //za sada 
        ValidateAudience = false, // za sada
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("Token:Secret").Value!)),
        ValidateLifetime = true, //valjda treba?
        ClockSkew = TimeSpan.Zero //radi debugginga
    };
});

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IProductCategoryService, ProductCategoryService>();

// sta je scoped sta singleton a sta transient ?????
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins);

//app.UseAuthentication(); //treba li ovo ovdje
app.UseAuthorization();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Images")),
    RequestPath = "/Images"
});

app.MapControllers();

app.Run();
