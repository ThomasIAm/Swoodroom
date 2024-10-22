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

    const saveSwoodroom = await saveToDatabase(
      "aanvraag@swoodroom.nl",
      "info@swoodroom.nl",
      output.subject,
      output.name,
      output.package,
      output.message,
    );

    const saveSender = await saveToDatabase(
      output.email,
      "info@swoodroom.nl",
      output.subject,
      output.name,
      output.package,
      output.message,
    );

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

    const swoodroomResult = await sendMail(context.env, reqBodySwoodroom);

    const senderResult = await sendMail(context.env, reqBodySender);

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

async function saveToDatabase(from, to, sub, name, service, message) {
  try {
    const randomId = Math.floor(Math.random() * 999999);
    const ps = await context.env.DB.prepare(
      "INSERT INTO mails (id, 'from', 'to', sub, name, package, message) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
    ).bind(randomId, from, to, sub, name, service, message);
    const result = await ps.run();

    return ps;
  } catch (error) {
    return new Response("Error saving to database", { status: 400 });
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
          message: message,
        },
      },
    ],
    from: {
      email: from,
    },
    template_id: "d-dab4e5a2d76f4c11aab8f71d5186e1a7",
    asm: {
      group_id: 27715,
    },
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
