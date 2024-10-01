/**
 * POST /api/submit
 */
export async function onRequestPost(context) {
  try {
    let input = await context.request.formData();

    // Convert FormData to JSON
    // NOTE: Allows multiple values per key
    let output = {};
    for (let [key, value] of input) {
      let tmp = output[key];
      if (tmp === undefined) {
        output[key] = value;
      } else {
        output[key] = [].concat(tmp, value);
      }
    }

    const reqBody = {
      personalizations: [{
          to: [{
            email: "info@swoodroom.nl",
          }],
      }],
      from: {
        email: "aanvraag@swoodroom.nl",
      },
      subject: output.subject,
      // subject: "test",
      content: [{
        type: "text/plain",
        value: `email: ${output.email}\nname: ${output.name}\npackage: ${output.package}\nmessage:\n${output.message}`
        // value: "test",
      }],
    };

    await sendMail(context.env, reqBody);

    let pretty = JSON.stringify(output, null, 2);
    return new Response(pretty, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
  } catch (err) {
    return new Response("Error parsing JSON content", { status: 400 });
  }
}

async function sendMail(env, body) {
  try {
    const result = fetch(
      "https://api.sendgrid.com/v3/mail/send",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    return result;
    // return new Response(JSON.stringify(body), {
    //   headers: {
    //     "Content-Type": "application/json;charset=utf-8",
    //   },
    // });
  } catch (error) {
    return new Response("Error sending mail", { status: 400 });
  }
}