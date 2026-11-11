
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using PetalFairyApi.Models;

namespace PetalFairyApi.Controllers;

[ApiController]
[Route("api/payments")]
public class PaymentsController : ControllerBase
{
    private readonly NpgsqlDataSource _dataSource;

    public PaymentsController(NpgsqlDataSource dataSource)
    {
        _dataSource = dataSource;
    }

    [HttpPost("submit")]
    public async Task<IActionResult> SubmitPayment(
        [FromBody] PaymentSubmission payment)
    {
        if (string.IsNullOrWhiteSpace(payment.CustomerName) ||
            string.IsNullOrWhiteSpace(payment.Contact) ||
            string.IsNullOrWhiteSpace(payment.PaymentMethod) ||
            payment.Amount <= 0)
        {
            return BadRequest(new
            {
                success = false,
                message = "Invalid payment information."
            });
        }

        const string sql = """
            INSERT INTO payment_submissions
            (id, customer_name, email, amount, payment_method,
             reference_number, status, created_at)
            VALUES
            (@id, @customer_name, @email, @amount, @payment_method,
             @reference_number, @status, NOW())
            RETURNING id, created_at;
            """;

        await using var connection =
            await _dataSource.OpenConnectionAsync();

        await using var command = new NpgsqlCommand(sql, connection);

        command.Parameters.AddWithValue("id", Guid.NewGuid());
        command.Parameters.AddWithValue("customer_name", payment.CustomerName);
        command.Parameters.AddWithValue("email", payment.Contact);
        command.Parameters.AddWithValue("amount", payment.Amount);
        command.Parameters.AddWithValue("payment_method", payment.PaymentMethod);
        command.Parameters.AddWithValue(
            "reference_number",
            (object?)payment.ReferenceNumber ?? DBNull.Value);
        command.Parameters.AddWithValue("status", "Pending");

        await using var reader = await command.ExecuteReaderAsync();
        await reader.ReadAsync();

        return Ok(new
        {
            success = true,
            message = "Payment submission saved successfully!",
            id = reader.GetGuid(0),
            createdAt = reader.GetDateTime(1)
        });
    }
}