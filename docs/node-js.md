# Node JS

1. API endpoint example -

   - `GET` - /companies - should get the list of all companies
   - `GET` - /companies/34 - should get the detail of company 34
   - `DELETE` - /companies/34 - should delete company 34
   - `GET` - /companies/3/employees - should get the list of all employees from company 3
   - `GET` - /companies/3/employees/45 - should get the details of employee 45, which belongs to company 3
   - `DELETE` - /companies/3/employees/45 - should delete employee 45, which belongs to company 3
   - `POST` - /companies - should create a new company and return the details of the new company created
   - `GET` - /companies?sort=rank_asc - would sort the companies by its rank in ascending order.
   - `GET` - /companies?category=banking&location=india - would filter the companies list data with the company category of Banking and where the location is India.
   - `GET` - /companies?search=Digital Mckinsey
   - `GET` - /companies?page=23 - means get the list of companies on 23rd page.
   - `http://api.yourservice.com/v1/companies/34/employees` - has the version number of the API in the path. If there is any major breaking update, we can name the new set of APIs as v2 or v1.x.x.

2. Use limit and offset. It is flexible for the user and common in leading databases. The default should be limit=20 and offset=0 - `GET /cars?offset=10&limit=5`

3. Do not return the plain text as a response from the API. Although this is not imposed or mandated by any REST architectural style, most REST APIs by convention use `JSON` as the data format.

4. Return the error details in the response body. Even better if you include which fields were affected by the error!

   ```json
   {
     "error": "Invalid payload.",
     "detail": {
       "name": "This field is required."
     }
   }
   ```

5. Use kebab-case for URLs - For example, if you want to get the list of orders.

   Bad:

   ```default
   /systemOrders or /system_orders
   ```

   Good:

   ```default
   /system-orders
   ```

6. Use camelCase for Parameters - For example, if you want to get products from a particular shop.

   Bad:

   ```default
   /system-orders/{order_id} or /system-orders/{OrderId}
   ```

   Good:

   ```default
   /system-orders/{orderId}
   ```

7. Plural Name to Point to a Collection - If you want to get all the users of a system.

   Bad:

   ```default
   GET /user or GET /User
   ```

   Good:

   ```default
   GET /users
   ```

8. URL Starts With a Collection and Ends With an Identifier - If want to keep the concept singular and consistent.

   Bad:

   ```default
   GET /shops/:shopId/category/:categoryId/price
   ```

   This is bad because it’s pointing to a property instead of a resource.
   Good:

   ```default
   GET /shops/:shopId/ or GET /category/:categoryId
   ```

9. Keep Verbs Out of Your Resource URL - Don’t use verbs to express your intention in the URL. Instead, use proper HTTP methods to describe the operation.

   Bad:

   ```default
   POST /updateUser/{userId} or GET /getUsers
   ```

   Good:

   ```default
   PUT /users/{userId}
   ```

10. Use Verbs for Non-Resource URL - You have an endpoint that returns nothing but an operation. In this case, you can use verbs. For example, if you want to resend the alert to a user.

    Good:

    ```default
    POST /alerts/245743/resend
    ```

    Keep in mind that these are not our CRUD operations. Rather, these are considered functions that do a specific job in our system.

11. Use camelCase for JSON property - If you’re building a system in which the request body or response is JSON, the property names should be in camelCase

    Bad

    ```default
    {
    user_name: "Mohammad Faisal"
    user_id: "1"
    }
    ```

    Good

    ```default
    {
    userName: "Mohammad Faisal"
    userId: "1"
    }
    ```

12. Monitoring - RESTful HTTP services MUST implement the /health and /version and /metrics API endpoints. They will provide the following info.

    ```default
    /health
    ```

    Respond to requests to /health with a 200 OK status code.

    ```default
    /version
    ```

    Respond to request to /version with the version number.

    ```default
    /metrics
    ```

    This endpoint will provide various metrics like average response time. /debug and /status endpoints are also highly recommended.

13. Use Simple Ordinal Number as Version - Always use versioning for the API and move it all the way to the left so that it has the highest scope. The version number should be v1, v2 etc.

    Good:

    ```default
    http://api.domain.com/v1/shops/3/products
    ```

    Always use versioning in your API because if the API is being used by external entities, changing the endpoint can break their functionality.

14. Response - If an API returns a list of objects always include the total number of resources in the response. You can use the total property for this.

    Bad:

    ```default
    {
      users: [
          ...
      ]
    }
    ```

    Good:

    ```default
    {
      users: [
          ...
      ],
    total: 34
    }
    ```

15. Accept limit and offset Parameters - Always accept limit and offset parameters in GET operations. This is because it’s necessary for pagination on the front end.

    Good:

    ```default
    GET /shops?offset=5&limit=5
    ```

16. Take fields Query Parameter - The amount of data being returned should also be taken into consideration. Add a fields parameter to expose only the required fields from your API. It also helps to reduce the response size in some cases. Example: Only return the name, address, and contact of the shops.

    ```default
    GET /shops?fields=id,name,address,contact
    ```

17. Validate the Content-Type - The server should not assume the content type. For example, if you accept application/x-www-form-urlencoded then an attacker can create a form and trigger a simple POST request. So, always validate the content-type and if you want to go with a default one use content-type: application/json

18. Use HTTP Methods for CRUD Functions - HTTP methods serve the purpose of explaining CRUD functionality.

    - `GET`: To retrieve a representation of a resource.
    - `POST`: To create new resources and sub-resources.
    - `PUT`: To update existing resources.
    - `PATCH`: To update existing resources. It only updates the fields that were supplied, leaving the others alone
    - `DELETE`: To delete existing resources.

19. Use the Relation in the URL For Nested Resources. Some practical examples are:

    - `GET /shops/2/products`: Get the list of all products from shop 2.
    - `GET /shops/2/products/31`: Get the details of product 31, which belongs to shop 2.
    - `DELETE /shops/2/products/31`: Should delete product 31, which belongs to shop 2.
    - `PUT /shops/2/products/31`: Should update the info of product 31, Use PUT on resource-URL only, not the collection.
    - `POST /shops`: Should create a new shop and return the details of the new shop created. Use POST on collection-URLs.

20. CORS - Do support CORS (Cross-Origin Resource Sharing) headers for all public-facing APIs. Consider supporting a CORS allowed origin of “\*”, and enforcing authorization through valid OAuth tokens. Avoid combining user credentials with origin validation.

21. Make good use of HTTP 202 Accepted - The code `202 Accepted` to be a very handy alternative to `201 Created`. It basically means: I, the server, have understood your request. I have not created the resource (yet), but that is fine. There are two main scenarios where 202 Accepted to be especially suitable:

    - If the resource will be created as a result of future processing — example: After a job/process has finished.
    - If the resource already existed in some way, but this should not be interpreted as an error.

22. Know the difference between 401 Unauthorized and 403 Forbidden - Has the consumer not provided authentication credentials? Was their SSO Token invalid/timed out? 👉 401 Unauthorized. Was the consumer correctly authenticated, but they don’t have the required permissions/proper clearance to access the resource? 👉 403 Forbidden.

23. Pay special attention to HTTP status codes - The worst thing your API could do is return an error response with a 200 OK status code. Make use of the HTTP status code, and only use the response body to provide error details.

    ```default
    HTTP/1.1 400 Bad Request
    Content-Type: application/json
    {
        "error": "Expected at least three items in the list."
    }
    ```

24. Return the codes against the verbs accordingly. A response’s status is specified by its status code: 1xx for information, 2xx for success, 3xx for redirection, 4xx for client errors and 5xx for server errors -

    - `GET`: 200 OK
    - `PUT`: 200 OK
    - `POST`: 201 Created
    - `PATCH`: 200 OK
    - `DELETE`: 204 No Content

25. Return the error details in the response body - When an API server handles an error, it is convenient (_and recommended_) to return error details within the JSON body to help consumers with debugging. Even better if you include which fields were affected by the error!

    ```json
    {
      "error": "Invalid payload.",
      "detail": {
        "name": "This field is required."
      }
    }
    ```

26. Do not return plain text - Although this is not imposed or mandated by any REST architectural style, most REST APIs by convention use JSON as the data format. However, it is not good enough to just return a response body containing a JSON-formatted String. You should still specify the Content-Type header. It must be set to the value application/json.

27. At a high-level, verbs map to CRUD operations: GET means Read, POST means Create, PUT and PATCH mean Update, and DELETE means Delete.

28. Use `HATEOAS` to build self-documenting API, if the API's are getting consumed by some external team members.

29. Use `Async/Await` instead of callbacks as it makes code more readable.

30. Use `__dirname` variable and `path()` function like below to avoid different window inconsistency while defining path of a file.

    ```typescript
    app.get('/', function (req, res) {
      res.sendFile(path.join(_dirname, 'views/index.html'));
    });
    ```

31. We should group our folder based on feature not types. It can also contains `config` and `utils` folder.
