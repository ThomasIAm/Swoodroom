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

    const reqBodySwoodroom = composeRequestBody(
      "info@swoodroom.nl",
      "aanvraag@swoodroom.nl",
      output.subject,
      output.name,
      output.package,
      output.message,
    );

    const reqBodySender = composeRequestBody(
      output.email,
      "info@swoodroom.nl",
      output.subject,
      output.name,
      output.package,
      output.message,
    );

    await sendMail(context.env, reqBodySwoodroom);

    await sendMail(context.env, reqBodySender);

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

function composeRequestBody(to, from, sub, name, service, message) {
  const body = {
    personalizations: [
      {
        to: [
          {
            email: to,
          },
        ],
        dynamic_template_data: {
          subject: sub,
          email: to,
          first_name: name,
          package: service,
          message: message
        },
      },
    ],
    from: {
      email: from,
    },
    template_id: "d-dab4e5a2d76f4c11aab8f71d5186e1a7",
    asm: {
      group_id: 27715
    }
  };

  return body;
}

async function sendMail(env, body) {
  try {
    const result = fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    return result;
  } catch (error) {
    return new Response("Error sending mail", { status: 400 });
  }
}
