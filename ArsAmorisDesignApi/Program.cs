using Microsoft.EntityFrameworkCore;
using ArsAmorisDesignApi.Data;
using ArsAmorisDesignApi.Services.UserService;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using ArsAmorisDesignApi.Services.ProductService;
using Microsoft.Extensions.FileProviders;
using ArsAmorisDesignApi.Services.ProductCategoryService;
using Microsoft.AspNetCore.Localization;
using ArsAmorisDesignApi.Services.RefreshTokenService;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policyBuilder =>
                      {
                          policyBuilder.WithOrigins("http://localhost:5173")
                          .AllowAnyHeader().AllowAnyMethod().AllowCredentials();
                      });
});
// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();

string connectionString;
if (builder.Environment.IsDevelopment())
{
    connectionString = builder.Configuration.GetConnectionString("Development");
}
else
{
    connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");
}
builder.Services.AddDbContext<AppDbContext>(opt => opt.UseNpgsql(connectionString));
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
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminPolicy", p =>
        p.RequireClaim("isAdmin", "true"));
});

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IProductCategoryService, ProductCategoryService>();
builder.Services.AddScoped<IRefreshTokenService, RefreshTokenService>();

builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    options.DefaultRequestCulture = new RequestCulture("en");
});
// sta je scoped sta singleton a sta transient ?????
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Images")),
    RequestPath = "/Images"
});
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseCors(MyAllowSpecificOrigins);
}

//app.UseAuthentication(); //treba li ovo ovdje
app.UseAuthorization();
app.UseRequestLocalization();


app.MapControllers();
app.MapFallbackToController("Index", "Fallback");
app.Run();
