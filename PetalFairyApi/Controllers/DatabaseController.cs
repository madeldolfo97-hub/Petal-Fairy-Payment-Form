
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace PetalFairyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DatabaseController : ControllerBase
    {
        private readonly NpgsqlDataSource _dataSource;

        public DatabaseController(NpgsqlDataSource dataSource)
        {
            _dataSource = dataSource;
        }

        [HttpGet("test")]
        public async Task<IActionResult> TestConnection()
        {
            try
            {
                await using var connection =
                    await _dataSource.OpenConnectionAsync();

                await using var command =
                    new NpgsqlCommand(
                        "SELECT current_database()",
                        connection
                    );

                var databaseName =
                    await command.ExecuteScalarAsync();

                return Ok(new
                {
                    success = true,
                    message = "Connected to Supabase successfully!",
                    database = databaseName
                });
            }
            catch (Exception ex)
{
    Console.WriteLine("DATABASE ERROR: " + ex);

    return StatusCode(500, new
    {
        success = false,
        message = ex.Message
    });
}
        }
    }
}