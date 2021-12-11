# Best Practices

1. API endpoint example -
   - GET - /companies - should get the list of all companies
   - GET - /companies/34 - should get the detail of company 34
   - DELETE - /companies/34 - should delete company 34
   - GET - /companies/3/employees - should get the list of all employees from company 3
   - GET - /companies/3/employees/45 - should get the details of employee 45, which belongs to company 3
   - DELETE - /companies/3/employees/45 - should delete employee 45, which belongs to company 3
   - POST - /companies - should create a new company and return the details of the new company created
   - GET - /companies?sort=rank_asc - would sort the companies by its rank in ascending order.
   - GET - /companies?category=banking&location=india - would filter the companies list data with the company category of Banking and where the location is India.
   - GET - /companies?search=Digital Mckinsey
   - GET - /companies?page=23 - means get the list of companies on 23rd page.
   - <http://api.yourservice.com/v1/companies/34/employees> - has the version number of the API in the path. If there is any major breaking update, we can name the new set of APIs as v2 or v1.x.x.

Use limit and offset. It is flexible for the user and common in leading databases. The default should be limit=20 and offset=0
GET /cars?offset=10&limit=5

2. Do not return the plain text as a response from the API. Although this is not imposed or mandated by any REST architectural style, most REST APIs by convention use JSON as the data format.

3. Return the error details in the response body. Even better if you include which fields were affected by the error!

```

{
    "error": "Invalid payload.",
    "detail": {
        "name": "This field is required."
    }
}
```

## Code Reviews - Try to describe both what the commit changes and how it does it

```default

> BAD. Don't do this.
Make compile again
> Good.
Add jcsv dependency to fix IntelliJ compilation

```
