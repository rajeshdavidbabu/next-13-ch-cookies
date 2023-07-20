export async function TimeZone({ timeZone }: { timeZone: string }) {
  const res = await fetch(`http://worldtimeapi.org/api/timezone/${timeZone}`);
  const timeObject = await res.json();
  const timeString = new Date(timeObject.datetime).toString();

  return (
    <div>
      Rendered on the server at: {timeString} for {timeZone}
    </div>
  );
}
